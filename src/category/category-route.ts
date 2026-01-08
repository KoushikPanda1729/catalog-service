import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import updateCategoryValidator from "./update-category-validator";
import idParamValidator from "./id-param-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/utils/asyncHandler";
import { authenticate } from "../common/middleware/authenticate";
import { authorize } from "../common/middleware/authorize";
import { Roles } from "../common/constants/roles";

const router = Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(categoryService, logger);

router.get(
    "/",
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.getAll(req, res, next)
    )
);

router.get(
    "/:id",
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.getById(req, res, next)
    )
);

router.post(
    "/",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    categoryValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next)
    )
);

router.put(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    updateCategoryValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.update(req, res, next)
    )
);

router.delete(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        categoryController.delete(req, res, next)
    )
);

export default router;
