import { type Request, type Response, type NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { Product } from "./product-types";
import type { ProductService } from "./product-service";
import type { Logger } from "winston";
import type { UploadedFile } from "express-fileupload";
import type { IFileStorage } from "../common/types/IFileStorage";
import type { IMessageBroker } from "../common/types/broker";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private fileStorage: IFileStorage,
        private broker: IMessageBroker
    ) {}

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(
                createHttpError(400, "Validation Error", {
                    errors: result.array(),
                })
            );
        }

        const {
            name,
            description,
            image,
            category,
            priceConfiguration,
            attributes,
            isPublished,
        } = req.body as Omit<
            Product,
            "_id" | "tenantId" | "createdAt" | "updatedAt"
        >;

        const userRole = req.user?.role;
        const userTenant = req.user?.tenant;

        // Determine tenantId based on role
        let tenantId: string;

        if (userRole === "admin") {
            // Admin must provide tenantId in body
            const tenantIdFromBody = (req.body as { tenantId?: string })
                .tenantId;
            if (!tenantIdFromBody) {
                return next(
                    createHttpError(400, "Admin must provide tenantId")
                );
            }
            tenantId = tenantIdFromBody;
        } else if (userRole === "manager") {
            // Manager always uses their own tenant from token
            if (!userTenant) {
                return next(
                    createHttpError(400, "Manager tenant not found in token")
                );
            }
            tenantId = String(userTenant);
        } else {
            return next(createHttpError(403, "Unauthorized role"));
        }

        try {
            const product = await this.productService.create({
                name,
                description,
                image,
                category,
                priceConfiguration,
                attributes,
                tenantId,
                isPublished,
            } as Product);

            // Send message to broker
            await this.broker.sendMessage({
                topic: "product",
                key: product._id.toString(),
                value: JSON.stringify({
                    event: "product-created",
                    data: product,
                }),
            });

            this.logger.info(
                "Product created successfully " + product._id.toString()
            );
            res.status(201).json({
                message: "Product created successfully",
                product,
            });
        } catch (error) {
            // Handle MongoDB duplicate key error
            if (
                error instanceof Error &&
                "code" in error &&
                error.code === 11000
            ) {
                return next(
                    createHttpError(
                        409,
                        "Product with this name already exists"
                    )
                );
            }
            throw error;
        }
    }

    async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(
                createHttpError(400, "Validation Error", {
                    errors: result.array(),
                })
            );
        }

        const { id } = req.params;

        if (!id) {
            return next(createHttpError(400, "Product ID is required"));
        }

        const userRole = req.user?.role;
        const userTenant = req.user?.tenant;

        // Fetch existing product to check ownership
        const existingProduct = await this.productService.getById(id);
        if (!existingProduct) {
            return next(createHttpError(404, "Product not found"));
        }

        // Check permissions based on role
        if (userRole === "manager") {
            if (String(existingProduct.tenantId) !== String(userTenant)) {
                return next(
                    createHttpError(
                        403,
                        "You can only update products from your own tenant"
                    )
                );
            }
        }

        const updateData = req.body as Partial<Product>;

        // Prevent tenant change for managers, ignore tenantId from body
        if (userRole === "manager") {
            delete updateData.tenantId;
        }

        const product = await this.productService.update(id, updateData);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        // Send message to broker
        await this.broker.sendMessage({
            topic: "product",
            key: product._id.toString(),
            value: JSON.stringify({
                event: "product-updated",
                data: product,
            }),
        });

        this.logger.info(
            "Product updated successfully " + product._id.toString()
        );
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    }

    async getAll(
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ): Promise<void> {
        const { q, categoryId, tenantId, isPublished, limit, page } = req.query;

        const filters: {
            q?: string;
            categoryId?: string;
            tenantId?: string;
            isPublished?: boolean;
            limit?: number;
            page?: number;
        } = {};

        if (q) filters.q = q as string;
        if (categoryId) filters.categoryId = categoryId as string;
        if (tenantId) filters.tenantId = tenantId as string;
        if (isPublished !== undefined)
            filters.isPublished = isPublished === "true";
        if (limit) filters.limit = parseInt(limit as string);
        if (page) filters.page = parseInt(page as string);

        const result = await this.productService.getAll(filters);
        this.logger.info("Fetched all products");
        res.status(200).json({
            message: "Products fetched successfully",
            ...result,
        });
    }

    async getById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(
                createHttpError(400, "Validation Error", {
                    errors: result.array(),
                })
            );
        }

        const { id } = req.params;

        if (!id) {
            return next(createHttpError(400, "Product ID is required"));
        }

        const product = await this.productService.getById(id);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        this.logger.info("Fetched product by ID: " + id);
        res.status(200).json({
            message: "Product fetched successfully",
            product,
        });
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(
                createHttpError(400, "Validation Error", {
                    errors: result.array(),
                })
            );
        }

        const { id } = req.params;

        if (!id) {
            return next(createHttpError(400, "Product ID is required"));
        }

        const userRole = req.user?.role;
        const userTenant = req.user?.tenant;

        if (userRole === "manager") {
            const existingProduct = await this.productService.getById(id);
            if (!existingProduct) {
                return next(createHttpError(404, "Product not found"));
            }
            if (String(existingProduct.tenantId) !== String(userTenant)) {
                return next(
                    createHttpError(
                        403,
                        "You can only delete products from your own tenant"
                    )
                );
            }
        }

        const product = await this.productService.delete(id);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        // Send message to broker
        await this.broker.sendMessage({
            topic: "product",
            key: product._id.toString(),
            value: JSON.stringify({
                event: "product-deleted",
                data: product,
            }),
        });

        this.logger.info("Product deleted successfully: " + id);
        res.status(200).json({
            message: "Product deleted successfully",
            product,
        });
    }

    async uploadImage(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next(createHttpError(400, "No files were uploaded"));
        }

        const uploadedFile = req.files.image as UploadedFile;

        if (!uploadedFile) {
            return next(createHttpError(400, "Image field is required"));
        }

        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
            return next(
                createHttpError(
                    400,
                    "Invalid file type. Only images are allowed (jpeg, jpg, png, webp, gif)"
                )
            );
        }

        const maxSize = 5 * 1024 * 1024;
        if (uploadedFile.size > maxSize) {
            return next(createHttpError(400, "File size exceeds 5MB limit"));
        }

        try {
            const result = await this.fileStorage.upload(
                uploadedFile.data,
                uploadedFile.name,
                uploadedFile.mimetype,
                "products"
            );

            this.logger.info(
                `Product image uploaded successfully: ${result.key}`
            );

            res.status(201).json({
                message: "Image uploaded successfully",
                data: {
                    url: result.url,
                    key: result.key,
                },
            });
        } catch (error) {
            this.logger.error("Image upload error:", error);
            return next(
                createHttpError(
                    500,
                    "Failed to upload image. Please try again."
                )
            );
        }
    }
}
