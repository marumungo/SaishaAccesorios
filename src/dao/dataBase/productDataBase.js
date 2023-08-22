const { productModel } = require("./models/product.model");

class ProductDaoDataBase {
    async getProducts() {
        try {
            return await productModel.find({});
        } catch (error) {
            return new Error(error);
        }
    }

    async getProductById(id) {
        try {
            return await productModel.findOne({_id: id});
        } catch (error) {
            return new Error(error);
        }
    }

    async getProductByCode(code) {
        try {
            return await productModel.findOne({code: code});
        } catch (error) {
            return new Error(error);
        }
    }

    async addProduct(product) {
        try {
            return await productModel.create(product);
        } catch (error) {
            return new Error(error);
        }
    }

    async updateProductById(id, updatedProduct) {
        try {
            return await productModel.updateOne({_id: id}, updatedProduct);
        } catch (error) {
            return new Error(error);
        }
    }

    async deleteProductById(id) {
        try {
            return await productModel.deleteOne({_id: id});
        } catch (error) {
            return new Error(error);
        }
    }
}

module.exports = ProductDaoDataBase;