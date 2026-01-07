import ProductModel from "./product-model";
import type { Product } from "./product-types";

export class ProductService {
    async create(productData: Product) {
        const product = new ProductModel(productData);
        return product.save();
    }

    async update(productId: string, productData: Partial<Product>) {
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            productData,
            { new: true, runValidators: true }
        );
        return product;
    }

    async getAll() {
        const products = await ProductModel.find().populate("category");
        return products;
    }

    async getById(productId: string) {
        const product =
            await ProductModel.findById(productId).populate("category");
        return product;
    }

    async delete(productId: string) {
        const product = await ProductModel.findByIdAndDelete(productId);
        return product;
    }
}
