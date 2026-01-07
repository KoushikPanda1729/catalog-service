import { body, param } from "express-validator";

export default [
    param("id")
        .exists()
        .withMessage("Category ID is required")
        .isMongoId()
        .withMessage("Invalid category ID"),

    body("name")
        .optional()
        .isString()
        .withMessage("category name must be a string"),

    body("priceCofigration")
        .optional()
        .isObject()
        .withMessage("priceCofigration must be an object"),

    body("priceCofigration.*.priceType")
        .optional()
        .isIn(["base", "additional"])
        .withMessage("priceType must be either 'base' or 'additional'"),

    body("priceCofigration.*.availableOptions")
        .optional()
        .isArray()
        .withMessage("availableOptions must be an array"),

    body("attributes")
        .optional()
        .isArray()
        .withMessage("attributes must be an array"),

    body("attributes.*.name")
        .optional()
        .isString()
        .withMessage("attribute name must be a string"),

    body("attributes.*.wigetType")
        .optional()
        .isIn(["switch", "radio"])
        .withMessage("wigetType must be either 'switch' or 'radio'"),

    body("attributes.*.defaultValue").optional(),

    body("attributes.*.availableOptions")
        .optional()
        .isArray()
        .withMessage("availableOptions must be an array"),
];
