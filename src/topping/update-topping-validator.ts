import { body, param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Topping ID is required")
        .isMongoId()
        .withMessage("Invalid topping ID"),

    body("name")
        .optional()
        .isString()
        .withMessage("Topping name must be a string")
        .trim()
        .notEmpty()
        .withMessage("Topping name cannot be empty"),

    body("image")
        .optional()
        .isString()
        .withMessage("Topping image must be a string")
        .trim()
        .notEmpty()
        .withMessage("Topping image cannot be empty"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => value >= 0)
        .withMessage("Price must be a non-negative number"),

    body("tenantId")
        .optional()
        .isString()
        .withMessage("Tenant ID must be a string")
        .trim()
        .notEmpty()
        .withMessage("Tenant ID cannot be empty"),

    body("isPublished")
        .optional()
        .isBoolean()
        .withMessage("isPublished must be a boolean"),
];
