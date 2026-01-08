import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import config from "config";
import logger from "./config/logger";
import type { HttpError } from "http-errors";
import categoryRouter from "./category/category-route";
import productRouter from "./product/product-route";
import toppingRouter from "./topping/topping-route";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true,
        limitHandler: (_req: Request, res: Response) => {
            res.status(413).json({
                errors: [
                    {
                        type: "FileSizeError",
                        message: "File size exceeds 5MB limit",
                        path: "",
                        location: "",
                    },
                ],
            });
        },
    })
);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).send(config.get("server.port"));
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/toppings", toppingRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});
export default app;
