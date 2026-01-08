import { param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Topping ID is required")
        .isMongoId()
        .withMessage("Invalid topping ID"),
];
