import { type Request, type Response, type NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { Topping } from "./topping-types";
import type { ToppingService } from "./topping-service";
import type { Logger } from "winston";
import type { UploadedFile } from "express-fileupload";
import type { IFileStorage } from "../common/services/IFileStorage";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
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

        const { name, image, price, isPublished } = req.body as Omit<
            Topping,
            "_id" | "tenantId"
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
            const topping = await this.toppingService.create({
                name,
                image,
                price,
                tenantId,
                isPublished,
            } as Topping);

            this.logger.info(
                "Topping created successfully " + topping._id?.toString()
            );
            res.status(201).json({
                message: "Topping created successfully",
                topping,
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
                        "Topping with this name already exists"
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
            return next(createHttpError(400, "Topping ID is required"));
        }

        const userRole = req.user?.role;
        const userTenant = req.user?.tenant;

        // Fetch existing topping to check ownership
        const existingTopping = await this.toppingService.getById(id);
        if (!existingTopping) {
            return next(createHttpError(404, "Topping not found"));
        }

        // Check permissions based on role
        if (userRole === "manager") {
            if (String(existingTopping.tenantId) !== String(userTenant)) {
                return next(
                    createHttpError(
                        403,
                        "You can only update toppings from your own tenant"
                    )
                );
            }
        }

        const updateData = req.body as Partial<Topping>;

        // Prevent tenant change for managers, ignore tenantId from body
        if (userRole === "manager") {
            delete updateData.tenantId;
        }

        const topping = await this.toppingService.update(id, updateData);

        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }

        this.logger.info(
            "Topping updated successfully " + topping._id?.toString()
        );
        res.status(200).json({
            message: "Topping updated successfully",
            topping,
        });
    }

    async getAll(
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ): Promise<void> {
        const { q, tenantId, isPublished, limit, page } = req.query;

        const filters: {
            q?: string;
            tenantId?: string;
            isPublished?: boolean;
            limit?: number;
            page?: number;
        } = {};

        if (q) filters.q = q as string;
        if (tenantId) filters.tenantId = tenantId as string;
        if (isPublished !== undefined)
            filters.isPublished = isPublished === "true";
        if (limit) filters.limit = parseInt(limit as string);
        if (page) filters.page = parseInt(page as string);

        const result = await this.toppingService.getAll(filters);
        this.logger.info("Fetched all toppings");
        res.status(200).json({
            message: "Toppings fetched successfully",
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
            return next(createHttpError(400, "Topping ID is required"));
        }

        const topping = await this.toppingService.getById(id);

        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }

        this.logger.info("Fetched topping by ID: " + id);
        res.status(200).json({
            message: "Topping fetched successfully",
            topping,
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
            return next(createHttpError(400, "Topping ID is required"));
        }

        const userRole = req.user?.role;
        const userTenant = req.user?.tenant;

        if (userRole === "manager") {
            const existingTopping = await this.toppingService.getById(id);
            if (!existingTopping) {
                return next(createHttpError(404, "Topping not found"));
            }
            if (String(existingTopping.tenantId) !== String(userTenant)) {
                return next(
                    createHttpError(
                        403,
                        "You can only delete toppings from your own tenant"
                    )
                );
            }
        }

        const topping = await this.toppingService.delete(id);

        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }

        this.logger.info("Topping deleted successfully: " + id);
        res.status(200).json({
            message: "Topping deleted successfully",
            topping,
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
                "toppings"
            );

            this.logger.info(
                `Topping image uploaded successfully: ${result.key}`
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
