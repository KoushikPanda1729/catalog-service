import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/utils/asyncHandler";

const router = Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    categoryValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next)
    )
);

export default router;
