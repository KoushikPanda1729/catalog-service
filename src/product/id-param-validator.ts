import { param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID"),
];
