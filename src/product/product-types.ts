import { Document, Types } from "mongoose";

export interface PriceConfiguration {
    priceType: "base" | "additional";
    availableOptions: Record<string, number>;
}

export interface Attribute {
    name: string;
    value: string | boolean;
}

export interface Product extends Document {
    name: string;
    description: string;
    image: string;
    category: Types.ObjectId;
    priceConfiguration: Map<string, PriceConfiguration>;
    attributes: Attribute[];
    tenantId: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
