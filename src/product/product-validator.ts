import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("description")
        .exists()
        .withMessage("Product description is required")
        .isString()
        .withMessage("Product description must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("image")
        .exists()
        .withMessage("Product image is required")
        .isString()
        .withMessage("Product image must be a string")
        .trim()
        .notEmpty()
        .withMessage("Product image cannot be empty"),

    body("category")
        .exists()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Category must be a valid MongoDB ObjectId"),

    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required")
        .isObject()
        .withMessage("Price configuration must be an object"),

    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("Price type is required")
        .isIn(["base", "additional"])
        .withMessage("Price type must be either 'base' or 'additional'"),

    body("priceConfiguration.*.availableOptions")
        .exists()
        .withMessage("Available options are required")
        .isObject()
        .withMessage("Available options must be an object"),

    body("attributes")
        .exists()
        .withMessage("Attributes are required")
        .isArray()
        .withMessage("Attributes must be an array"),

    body("attributes.*.name")
        .exists()
        .withMessage("Attribute name is required")
        .isString()
        .withMessage("Attribute name must be a string"),

    body("attributes.*.value")
        .exists()
        .withMessage("Attribute value is required"),

    body("tenantId")
        .exists()
        .withMessage("Tenant ID is required")
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
