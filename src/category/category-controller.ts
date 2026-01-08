import { type Request, type Response, type NextFunction } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import type { Category } from "./category-types";
import type { CategoryService } from "./category-service";
import type { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
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
        const { name, priceCofigration, attributes } = req.body as Category;
        const category = await this.categoryService.create({
            name,
            priceCofigration,
            attributes,
        });
        this.logger.info(
            "Category created successfully " + category._id.toString()
        );
        res.status(201).json({ message: "create categories", category });
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
            return next(createHttpError(400, "Category ID is required"));
        }

        const updateData = req.body as Partial<Category>;

        const category = await this.categoryService.update(id, updateData);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(
            "Category updated successfully " + category._id.toString()
        );
        res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    }

    async getAll(
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ): Promise<void> {
        const { q, limit, page } = req.query;

        const filters: {
            q?: string;
            limit?: number;
            page?: number;
        } = {};

        if (q) filters.q = q as string;
        if (limit) filters.limit = parseInt(limit as string);
        if (page) filters.page = parseInt(page as string);

        const result = await this.categoryService.getAll(filters);
        this.logger.info("Fetched all categories");
        res.status(200).json({
            message: "Categories fetched successfully",
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
            return next(createHttpError(400, "Category ID is required"));
        }

        const category = await this.categoryService.getById(id);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info("Fetched category by ID: " + id);
        res.status(200).json({
            message: "Category fetched successfully",
            category,
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
            return next(createHttpError(400, "Category ID is required"));
        }

        const category = await this.categoryService.delete(id);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info("Category deleted successfully: " + id);
        res.status(200).json({
            message: "Category deleted successfully",
            category,
        });
    }
}
