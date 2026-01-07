import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { ProductController } from "./product-controller";
import productValidator from "./product-validator";
import updateProductValidator from "./update-product-validator";
import idParamValidator from "./id-param-validator";
import { ProductService } from "./product-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/utils/asyncHandler";
import { authenticate } from "../common/middleware/authenticate";
import { authorize } from "../common/middleware/authorize";
import { Roles } from "../common/constants/roles";

const router = Router();

const productService = new ProductService();

const productController = new ProductController(productService, logger);

router.get(
    "/",
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        productController.getAll(req, res, next)
    )
);

router.get(
    "/:id",
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        productController.getById(req, res, next)
    )
);

router.post(
    "/",
    authenticate,
    authorize([Roles.ADMIN]),
    productValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        productController.create(req, res, next)
    )
);

router.put(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN]),
    updateProductValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        productController.update(req, res, next)
    )
);

router.delete(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN]),
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        productController.delete(req, res, next)
    )
);

export default router;
