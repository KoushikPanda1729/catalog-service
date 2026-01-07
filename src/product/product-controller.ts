import { type Request, type Response, type NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { Product } from "./product-types";
import type { ProductService } from "./product-service";
import type { Logger } from "winston";
import type { UploadedFile } from "express-fileupload";
import type { IFileStorage } from "../common/services/IFileStorage";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private fileStorage: IFileStorage
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
            tenantId,
            isPublished,
        } = req.body as Product;

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

        this.logger.info(
            "Product created successfully " + product._id.toString()
        );
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
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

        const updateData = req.body as Partial<Product>;

        const product = await this.productService.update(id, updateData);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        this.logger.info(
            "Product updated successfully " + product._id.toString()
        );
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    }

    async getAll(
        _req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ): Promise<void> {
        const products = await this.productService.getAll();
        this.logger.info("Fetched all products");
        res.status(200).json({
            message: "Products fetched successfully",
            products,
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

        const product = await this.productService.delete(id);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

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
