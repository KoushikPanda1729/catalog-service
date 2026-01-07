import { body, param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("name")
        .optional()
        .isString()
        .withMessage("Product name must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("description")
        .optional()
        .isString()
        .withMessage("Product description must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("image")
        .optional()
        .isString()
        .withMessage("Product image must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product image cannot be empty"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid MongoDB ObjectId"),

    body("priceConfiguration")
        .optional()
        .isObject()
        .withMessage("Price configuration must be an object"),

    body("priceConfiguration.*.priceType")
        .optional()
        .isIn(["base", "additional"])
        .withMessage("Price type must be either 'base' or 'additional'"),

    body("priceConfiguration.*.availableOptions")
        .optional()
        .isObject()
        .withMessage("Available options must be an object"),

    body("attributes")
        .optional()
        .isArray()
        .withMessage("Attributes must be an array"),

    body("attributes.*.name")
        .optional()
        .isString()
        .withMessage("Attribute name must be a string"),

    body("attributes.*.value").optional(),

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
