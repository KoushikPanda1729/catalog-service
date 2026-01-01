import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";

const router = Router();

const categoryController = new CategoryController();

router.post(
    "/",
    categoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        categoryController.create(req, res, next)
);

export default router;
