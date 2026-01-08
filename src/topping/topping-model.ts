import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import type { Topping } from "./topping-types";

const toppingSchema = new mongoose.Schema<Topping>(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        tenantId: {
            type: String,
            required: true,
        },
        isPublished: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

toppingSchema.plugin(aggregatePaginate);

const ToppingModel = mongoose.model<Topping>("Topping", toppingSchema);

export default ToppingModel;
