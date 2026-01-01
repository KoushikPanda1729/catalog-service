import mongoose from "mongoose";

interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

interface Attribute {
    name: string;
    wigetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceCofigration: PriceConfiguration;
    attributes: Attribute[];
}

const priceCofigrationSchema = new mongoose.Schema({
    priceType: { type: String, enum: ["base", "additional"], required: true },
    availableOptions: { type: [String], required: true },
});

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wigetType: { type: String, enum: ["switch", "radio"], required: true },
    defaultValue: { type: mongoose.Schema.Types.Mixed, required: true },
    availableOptions: { type: [String], required: true },
});

const categorySchema = new mongoose.Schema<Category>({
    name: { type: String, required: true, unique: true },
    priceCofigration: { type: Map, of: priceCofigrationSchema, required: true },
    attributes: { type: [attributeSchema], required: true },
});

const CategoryModel = mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
