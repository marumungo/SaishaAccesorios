class ProductDaoMemory {
    constructor() {
        this.products = [];
    };

    async getProducts() {
        return this.products;
    };

    async getProductById(id) {
        return this.products.find(product => id === product.id);
    };

    async addProduct(product) {
        return this.products.push(product);
    };

    async updateProductById(id, updatedProduct) {

    };

    async deleteProductById(id) {

    };
};

module.exports = ProductDaoMemory;