import { type Request, type Response, type NextFunction } from "express";

export class CategoryController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(req: Request, res: Response, next: NextFunction): void {
        res.status(2001).json("create categories");
    }
}
