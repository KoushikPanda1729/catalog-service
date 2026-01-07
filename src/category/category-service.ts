import CategoryModel from "./category-model";
import type { Category } from "./category-types";

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

    async getAll() {
        const categories = await CategoryModel.find();
        return categories;
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
