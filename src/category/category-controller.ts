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
}
