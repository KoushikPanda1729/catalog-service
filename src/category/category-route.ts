import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import updateCategoryValidator from "./update-category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/utils/asyncHandler";
import { authenticate } from "../common/middleware/authenticate";
import { authorize } from "../common/middleware/authorize";

const router = Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    categoryValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next)
    )
);

router.put(
    "/:id",
    authenticate,
    authorize(["admin"]),
    updateCategoryValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.update(req, res, next)
    )
);

export default router;
