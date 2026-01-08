import CategoryModel from "./category-model";
import type { Category } from "./category-types";
import type { AggregatePaginateModel } from "mongoose";

export class CategoryService {
    async create(categoryData: Category) {
        const category = new CategoryModel(categoryData);
        return category.save();
    }

    async update(categoryId: string, categoryData: Partial<Category>) {
        const category = await CategoryModel.findByIdAndUpdate(
            categoryId,
            categoryData,
            { new: true, runValidators: true }
        );
        return category;
    }

    async getAll(filters?: { q?: string; limit?: number; page?: number }) {
        const matchStage: Record<string, unknown> = {};

        if (filters?.q) {
            matchStage.name = { $regex: filters.q, $options: "i" };
        }

        const aggregate = CategoryModel.aggregate([{ $match: matchStage }]);

        const options = {
            page: filters?.page || 1,
            limit: filters?.limit || 10,
        };

        const result = await (
            CategoryModel as unknown as AggregatePaginateModel<Category>
        ).aggregatePaginate(aggregate, options);

        return {
            data: result.docs,
            total: result.totalDocs,
            page: result.page || 1,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    async getById(categoryId: string) {
        const category = await CategoryModel.findById(categoryId);
        return category;
    }

    async delete(categoryId: string) {
        const category = await CategoryModel.findByIdAndDelete(categoryId);
        return category;
    }
}
