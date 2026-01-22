import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { ToppingController } from "./topping-controller";
import toppingValidator from "./topping-validator";
import updateToppingValidator from "./update-topping-validator";
import idParamValidator from "./id-param-validator";
import { ToppingService } from "./topping-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/utils/asyncHandler";
import { authenticate } from "../common/middleware/authenticate";
import { authorize } from "../common/middleware/authorize";
import { Roles } from "../common/constants/roles";
import { FileStorageFactory } from "../common/services/file-storage/FileStorageFactory";

const router = Router();

const fileStorage = FileStorageFactory.create();
const toppingService = new ToppingService(fileStorage);

const toppingController = new ToppingController(
    toppingService,
    logger,
    fileStorage
);

router.get(
    "/",
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.getAll(req, res, next)
    )
);

router.get(
    "/:id",
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.getById(req, res, next)
    )
);

router.post(
    "/",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    toppingValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.create(req, res, next)
    )
);

router.put(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    updateToppingValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.update(req, res, next)
    )
);

router.delete(
    "/:id",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    idParamValidator,
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.delete(req, res, next)
    )
);

router.post(
    "/upload-image",
    authenticate,
    authorize([Roles.ADMIN, Roles.MANAGER]),
    asyncHandler((req: Request, res: Response, next: NextFunction) =>
        toppingController.uploadImage(req, res, next)
    )
);

export default router;
