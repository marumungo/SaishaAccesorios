const fs = require("fs");

const path = "./src/dao/file/products.json";

// Declaro los productos en forma de objetos, dentro de un array
let products = [
    {"title": "Zapatos", "description": "Con taco alto", "price": 3500, "category": "Calzados","thumbail": ["imagen1.com"], "code": 253, "stock": 45, "id": 1},
    {"title": "Pollera", "description": "Con volados", "price": 2600, "category": "Partes de abajo","thumbail": ["imagen2.com"], "code": 178, "stock": 28, "id": 2},
    {"title": "Jean", "description": "De color azul", "price": 2410, "category": "Partes de abajo","thumbail": ["imagen3.com"], "code": 345, "stock": 12, "id": 3},
    {"title": "Remera", "description": "Escote en v", "price": 1700, "category": "Partes de arriba","thumbail": ["imagen4.com"], "code": 56, "stock": 39, "id": 4},
    {"title": "Blusa", "description": "Con cuello alto", "price": 3100, "category": "Partes de arriba","thumbail": ["imagen5.com"], "code": 124, "stock": 24, "id": 5},
    {"title": "Pantalón cargo", "description": "Tiro alto", "price": 4280, "category": "Partes de abajo","thumbail": ["imagen6.com"], "code": 176, "stock": 53, "id": 6},
    {"title": "Saco", "description": "Abrigado de color beige", "price": 7240, "category": "Abrigos","thumbail": ["imagen7.com"], "code": 67, "stock": 26, "id": 7},
    {"title": "Sandalias", "description": "Abiertas con cierre", "price": 3520, "category": "Calzados","thumbail": ["imagen8.com"], "code": 89, "stock": 62, "id": 8},
    {"title": "Corset", "description": "Sin tirantes", "price": 5470, "category": "Partes de arriba","thumbail": ["imagen9.com"], "code": 53, "stock": 19, "id": 9},
    {"title": "Top", "description": "Escote corazón", "price": 1390, "category": "Partes de arriba","thumbail": ["imagen10.com"], "code": 25, "stock": 36, "id": 10}
];

class ProductDaoFile {
    constructor() {
        this.path = path;
    };

    async readFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);   
        } catch (error) {
            return [];
        };
    };

    async getProducts(){
        try {
            return await this.readFile();
        } catch (error) {
            return "No hay productos";
        };
    };    

    async getProductById(id) {
        try {
            const products = await this.readFile();
            const parseId = parseInt(id);
            const product = products.find(product => product.id === parseId);
            return product ? product : null;
        } catch (error) {
            return null;
        };
    };   

    async addProduct(product) {
        const productIndex = products.findIndex(p => p.code === product.code);

        // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
        if (product.title === "" || product.description === "" || typeof product.price !== "number" || product.category === "" || product.thumbail === "" || typeof product.code !== "number" || typeof product.stock !== "number") {
            return new Error("Se necesitan todos los campos!");
        } else if (productIndex >= 0) {
            return new Error("El producto ya está agregado");
        }

        // Generar un id autoincrementable
        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        // Agregar el producto al array
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');

        return product;
    };

    async updateProductById(id, updatedProduct) {
        const parseId = parseInt(id);

        // Buscar el producto con esa id, y actualizar sus datos (menos el id)
        const productIndex = products.findIndex(p => p.id === parseId);
        if (productIndex >= 0) {
            products[productIndex] = {id: parseId, ...updatedProduct};
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
            return updatedProduct;
        } else {
            return new Error ("No existe el producto a actualizar");
        };
    };

    async deleteProductById(id) {
        const parseId = parseInt(id);

        // Buscar el producto con esa id, y eliminarlo
        const productIndex = products.findIndex(p => p.id === parseId);
        if (productIndex >= 0) {
            products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        } else {
            return new Error ("No existe el producto a eliminar");
        };
    };
};


module.exports = ProductDaoFile;


