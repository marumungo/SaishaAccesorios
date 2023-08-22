class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    };

    getProducts = async () => {
        let result = await this.dao.getProducts();
        return result;
    };

    getProductById = async (id) => {
        let result = await this.dao.getProductById(id);
        return result;
    };

    getProductByCode = async (code) => {
        let result = await this.dao.getProductByCode(code);
        return result;
    };

    addProduct = async (product) => {
        let result = await this.dao.addProduct(product);
        return result;
    }

    updateProductById = async (id, updatedProduct) => {
        let result = await this.dao.updateProductById(id, updatedProduct);
        return result;
    }

    deleteProductById = async (id) => {
        let result = await this.dao.deleteProductById(id);
        return result;
    }
};

module.exports = ProductRepository;