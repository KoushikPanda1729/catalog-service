import { type Request, type Response, type NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { Product } from "./product-types";
import type { ProductService } from "./product-service";
import type { Logger } from "winston";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger
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
}
