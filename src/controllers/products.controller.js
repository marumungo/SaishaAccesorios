const { productModel } = require("../dao/dataBase/models/product.model");
const { productService, userService, cartService } = require("../service/index.service");
const { Error } = require("../utils/CustomError/Errors");
const { CustomError } = require("../utils/CustomError/CustomError");
const { generateProductErrorInfo } = require("../utils/CustomError/info");
const { winstonLogger } = require("../config/loggers");
const { default: mongoose } = require("mongoose");
const cartsController = require("./carts.controller");
const { sendProductDeletedMail } = require("../utils/sendProductDeletedMail");
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

            const cart = await cartsController.getCartByOwner(user._id);

            let noEmail = false;
            if (!user.email) {
                noEmail = true;
            }

            // Obtengo los productos
            let getProducts = await productService.getProducts();

            res.render("products", { user: user, products: getProducts, cart: cart, noEmail });
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
            
            // Obtengo los datos del usuario que inició sesión, si no hay redirecciono al login
            if (!req.session.user) {
                return res.redirect("/");
            }

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartsController.getCartByOwner(user._id);

            let emailExists = false;
            let noEmail = true;
            if (user.email) {
                emailExists = true;
                noEmail = false;
            }

            let isAdmin = false;
            if (user.role === "admin") {
                isAdmin = true;
            };

            // Obtengo el producto segun la id
            const getProductById = await productService.getProductById(id);

            // Validación de si existe o no la id
            if (!getProductById) {
                return res.render("404NotFound");
            } else {
                return res.render("individualProduct", { user, cart, product: getProductById, isAdmin, emailExists, noEmail});
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
            winstonLogger.error(error);
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
    deleteProductById = async (req, res) => {
        const { id } = req.params;

        // Obtengo los datos del usuario que inició sesión
        const username = req.session.user.username;
        const user = await userService.getUserByUsername(username);

        const cart = await cartsController.getCartByOwner(user._id);

        // Verificar si el producto a eliminar tiene como owner un usuario premium
        const product = await productService.getProductById(id);

        const owner = await userService.getUserByEmail(product.owner);

        await productService.deleteProductById(id); 
        
        if (owner.role === "premium") {
            await sendProductDeletedMail(owner.email);
        }

        return res.render("products", {user, cart});
    };
};

module.exports = new ProductController();