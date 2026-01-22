import ProductModel from "./product-model";
import type { Product } from "./product-types";
import type { IFileStorage } from "../common/types/IFileStorage";
import type { AggregatePaginateModel } from "mongoose";
import mongoose from "mongoose";

export class ProductService {
    constructor(private fileStorage?: IFileStorage) {}

    async create(productData: Product) {
        const product = new ProductModel(productData);
        return product.save();
    }

    async update(productId: string, productData: Partial<Product>) {
        const existingProduct = await ProductModel.findById(productId);

        if (!existingProduct) {
            return null;
        }

        if (
            productData.image &&
            existingProduct.image &&
            productData.image !== existingProduct.image &&
            this.fileStorage
        ) {
            const oldImageKey = this.extractS3Key(existingProduct.image);
            if (oldImageKey) {
                try {
                    await this.fileStorage.delete(oldImageKey);
                } catch (error) {
                    console.error("Failed to delete old image:", error);
                }
            }
        }

        const product = await ProductModel.findByIdAndUpdate(
            productId,
            productData,
            { new: true, runValidators: true }
        );
        return product;
    }

    async getAll(filters?: {
        q?: string;
        categoryId?: string;
        tenantId?: string;
        isPublished?: boolean;
        limit?: number;
        page?: number;
    }) {
        const matchStage: Record<string, unknown> = {};

        if (filters?.q) {
            matchStage.name = { $regex: filters.q, $options: "i" };
        }

        if (filters?.categoryId) {
            if (mongoose.Types.ObjectId.isValid(filters.categoryId)) {
                matchStage.category = new mongoose.Types.ObjectId(
                    filters.categoryId
                );
            }
        }

        if (filters?.tenantId) {
            matchStage.tenantId = filters.tenantId;
        }

        if (filters?.isPublished !== undefined) {
            matchStage.isPublished = filters.isPublished;
        }

        const aggregate = ProductModel.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        const options = {
            page: filters?.page || 1,
            limit: filters?.limit || 10,
        };

        const result = await (
            ProductModel as unknown as AggregatePaginateModel<Product>
        ).aggregatePaginate(aggregate, options);

        return {
            data: result.docs,
            total: result.totalDocs,
            page: result.page || 1,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    async getById(productId: string) {
        const product =
            await ProductModel.findById(productId).populate("category");
        return product;
    }

    async delete(productId: string) {
        const product = await ProductModel.findById(productId);

        if (!product) {
            return null;
        }

        if (product.image && this.fileStorage) {
            const imageKey = this.extractS3Key(product.image);
            if (imageKey) {
                try {
                    await this.fileStorage.delete(imageKey);
                } catch (error) {
                    console.error("Failed to delete product image:", error);
                }
            }
        }

        await ProductModel.findByIdAndDelete(productId);
        return product;
    }

    private extractS3Key(imageUrl: string): string | null {
        try {
            const url = new URL(imageUrl);
            return url.pathname.substring(1);
        } catch {
            return null;
        }
    }
}
