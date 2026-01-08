import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import type { Attribute, Category, PriceConfiguration } from "./category-types";

const priceCofigrationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: { type: String, enum: ["base", "additional"], required: true },
    availableOptions: { type: [String], required: true },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: { type: String, required: true },
    wigetType: { type: String, enum: ["switch", "radio"], required: true },
    defaultValue: { type: mongoose.Schema.Types.Mixed, required: true },
    availableOptions: { type: [String], required: true },
});

const categorySchema = new mongoose.Schema<Category>({
    name: { type: String, required: true },
    priceCofigration: { type: Map, of: priceCofigrationSchema, required: true },
    attributes: { type: [attributeSchema], required: true },
    tenantId: { type: String, required: true },
});

// Compound index: name must be unique per tenant
categorySchema.index({ name: 1, tenantId: 1 }, { unique: true });

categorySchema.plugin(aggregatePaginate);

const CategoryModel = mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
