import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import type { Attribute, PriceConfiguration, Product } from "./product-types";

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: { type: String, enum: ["base", "additional"], required: true },
    availableOptions: {
        type: Map,
        of: Number,
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const productSchema = new mongoose.Schema<Product>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema,
            required: true,
        },
        attributes: { type: [attributeSchema], required: true },
        tenantId: { type: String, required: true },
        isPublished: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(aggregatePaginate);

const ProductModel = mongoose.model<Product>("Product", productSchema);

export default ProductModel;
