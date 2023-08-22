const { productModel } = require("../dao/dataBase/models/product.model");
const { productService, userService, cartService } = require("../service/index.service");
const { Error } = require("../utils/CustomError/Errors");
const { CustomError } = require("../utils/CustomError/CustomError");
const { generateProductErrorInfo } = require("../utils/CustomError/info");
const { winstonLogger } = require("../config/loggers");
const { default: mongoose } = require("mongoose");
const cartsController = require("./carts.controller");
const Swal = require('sweetalert2').default;
class ProductController {
    // GET en el que se verán todos los productos
    getProducts = async (req, res) => {
        try {
            // Obtengo los datos del usuario que inició sesión, si no hay redirecciono al login
            if (!req.session.user) {
                return res.redirect("/");
            }

            const username = req.session.user.username;

            const user = await userService.getUserByUsername(username);
            const oid = user._id
            const cart = await cartsController.getCartByOwner(oid);

            // Obtengo los productos
            let getProducts = await productService.getProducts();
            // res.status(200).send({
            //     status: "success",
            //     payload: getProducts
            // });
            res.render("products", { user: user, products: getProducts, cart: cart });
        } catch (error) {
            res.status(500).send({ error: error.message });
        };
    };

    // GET que devuelve un producto a partir de su id
    getProductById = async (req, res) => {
        try {
            const { id } = req.params;

            // Validación de si es valida o no la id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.render("404NotFound");
            }

            if (!req.session.user) {
                return res.redirect("/");
            }

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartsController.getCartByOwner(user._id);

            // Obtengo el producto segun la id
            const getProductById = await productService.getProductById(id);

            // Validación de si existe o no la id
            if (!getProductById) {
                // return res.status(400).send({error: "No existe un producto con esa ID"});
                return res.render("404NotFound");
            } else {
                return res.render("individualProduct", { user, cart, product: getProductById});
                // res.status(200).send({
                //     status: "success",
                //     payload: getProductById
                // });
            }
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    }

    // GET que devuelve un producto a partir de su code
    getProductByCode = async (req, res) => {
        try {
            const { code } = req.params;

            // Obtengo el producto segun el code
            const getProductByCode = await productService.getProductByCode(code);

            // Validación de si existe o no el code
            if (!getProductByCode) {
                // return res.status(400).send({error: "No existe un producto con ese code"});
                return res.render("404NotFound");
            }
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    }
    
    // POST que agrega nuevos productos al array
    addProduct = async (req, res, next) => {
        try {
            const {title, description, price, category, stock, code, imageUrl} = req.body;
            
            if (!req.session.user) {
                return res.redirect("/");
            }
            
            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);
            
            const cart = await cartsController.getCartByOwner(user._id);

            // Validación de si estan todos los datos
            let missingInfo = false;

            if (!title || !description || !price || !category || !stock || !code || !imageUrl) {
                // CustomError.createError({
                //     name: 'Product creation error',
                //     cause: generateProductErrorInfo({
                //         title,
                //         description,
                //         price,
                //         category,
                //         stock,
                //         code,
                //         imageUrl
                //     }),
                //     message: 'Error trying to create product',
                //     code: Error.INVALID_TYPE_ERROR
                // });
                missingInfo = true;
                return res.render("addProduct", { user, cart, missingInfo });
            };

            // El dueño del producto será el email del usuario que inició sesión o "admin" si es desconocido
            let owner
            if (req.session.user.email) {
                owner = req.session.user.email
            } else {
                owner = "admin"
            }

            const existingProduct = await productService.getProductByCode(code);
            let existingCode = false;

            if (existingProduct) {
                existingCode = true;
                return res.render("addProduct", { user, cart, existingCode })
            };
            
            // Creo el producto en la base de datos
            const product = {
                title,
                description,
                price,
                category,
                stock,
                code,
                imageUrl,
                owner: owner
            };

            let addProduct = await productService.addProduct(product);
            let success = false;

            if (addProduct) {
                success = true;
                return res.render("addProduct", { user, cart, success });
            }
        } catch (error) {
            console.log(error);
        }; 
    };
    
    // PUT que actualiza un producto según su id
    updateProductById = async (req, res) => {
        try {
            const { id } = req.params;
            const updateProduct = req.body;
    
            const updatedProduct = await productService.updateProductById(id, updateProduct);
            res.status(200).send({
                status: "success",
                payload: updatedProduct
            });
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    };
    
    // DELETE que elimina un producto según su id
    deleteProducts = async (req, res) => {
        const { id } = req.params;

        const getProductById = await productService.getProductById(id);

        if (getProductById.owner !== req.session.user.email && req.session.user.role !== "admin") {
            return res.status(400).send({error: "Debes ser admin o creador del producto para poder eliminarlo"});
        };
        
        const deleteProductById = await productService.deleteProductById(id);
        
        res.status(200).send({
            status: "success",
            payload: deleteProductById
        });    
    };
};

module.exports = new ProductController();