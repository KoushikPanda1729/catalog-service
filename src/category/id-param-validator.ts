import { param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Category ID is required")
        .isMongoId()
        .withMessage("Invalid category ID"),
];
