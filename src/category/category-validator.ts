import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("category name is required")
        .isString()
        .withMessage("category name must be a string"),
    body("priceCofigration")
        .exists()
        .withMessage("priceCofigration is required")
        .isObject()
        .withMessage("priceCofigration must be an object"),
    body("priceCofigration.*.priceType")
        .exists()
        .withMessage("priceType is required")
        .isIn(["base", "additional"])
        .withMessage("priceType must be either 'base' or 'additional'"),
    body("priceCofigration.*.availableOptions")
        .exists()
        .withMessage("availableOptions are required")
        .isArray()
        .withMessage("availableOptions must be an array"),
    body("attributes")
        .exists()
        .withMessage("attributes are required")
        .isArray()
        .withMessage("attributes must be an array"),
    body("attributes.*.name")
        .exists()
        .withMessage("attribute name is required")
        .isString()
        .withMessage("attribute name must be a string"),
    body("attributes.*.wigetType")
        .exists()
        .withMessage("wigetType is required")
        .isIn(["switch", "radio"])
        .withMessage("wigetType must be either 'switch' or 'radio'"),
    body("attributes.*.defaultValue")
        .exists()
        .withMessage("defaultValue is required"),
    body("attributes.*.availableOptions")
        .exists()
        .withMessage("availableOptions are required")
        .isArray()
        .withMessage("availableOptions must be an array"),
];
