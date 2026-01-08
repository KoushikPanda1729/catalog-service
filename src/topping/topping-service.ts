import ToppingModel from "./topping-model";
import type { Topping } from "./topping-types";
import type { AggregatePaginateModel } from "mongoose";
import type { IFileStorage } from "../common/services/IFileStorage";
import mongoose from "mongoose";

export class ToppingService {
    constructor(private fileStorage?: IFileStorage) {}

    async create(toppingData: Topping) {
        const topping = new ToppingModel(toppingData);
        return topping.save();
    }

    async update(toppingId: string, toppingData: Partial<Topping>) {
        const existingTopping = await ToppingModel.findById(toppingId);

        if (!existingTopping) {
            return null;
        }

        if (
            toppingData.image &&
            existingTopping.image &&
            toppingData.image !== existingTopping.image &&
            this.fileStorage
        ) {
            const oldImageKey = this.extractS3Key(existingTopping.image);
            if (oldImageKey) {
                try {
                    await this.fileStorage.delete(oldImageKey);
                } catch (error) {
                    console.error("Failed to delete old image:", error);
                }
            }
        }

        const topping = await ToppingModel.findByIdAndUpdate(
            toppingId,
            toppingData,
            { new: true, runValidators: true }
        );
        return topping;
    }

    async getAll(filters?: {
        q?: string;
        tenantId?: string;
        isPublished?: boolean;
        limit?: number;
        page?: number;
    }) {
        const matchStage: Record<string, unknown> = {};

        if (filters?.q) {
            matchStage.name = { $regex: filters.q, $options: "i" };
        }

        if (filters?.tenantId) {
            if (mongoose.Types.ObjectId.isValid(filters.tenantId)) {
                matchStage.tenantId = new mongoose.Types.ObjectId(
                    filters.tenantId
                );
            }
        }

        if (filters?.isPublished !== undefined) {
            matchStage.isPublished = filters.isPublished;
        }

        const aggregate = ToppingModel.aggregate([{ $match: matchStage }]);

        const options = {
            page: filters?.page || 1,
            limit: filters?.limit || 10,
        };

        const result = await (
            ToppingModel as unknown as AggregatePaginateModel<Topping>
        ).aggregatePaginate(aggregate, options);

        return {
            data: result.docs,
            total: result.totalDocs,
            page: result.page || 1,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    async getById(toppingId: string) {
        const topping = await ToppingModel.findById(toppingId);
        return topping;
    }

    async delete(toppingId: string) {
        const topping = await ToppingModel.findById(toppingId);

        if (!topping) {
            return null;
        }

        if (topping.image && this.fileStorage) {
            const imageKey = this.extractS3Key(topping.image);
            if (imageKey) {
                try {
                    await this.fileStorage.delete(imageKey);
                } catch (error) {
                    console.error("Failed to delete topping image:", error);
                }
            }
        }

        await ToppingModel.findByIdAndDelete(toppingId);
        return topping;
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
