const { v4: uuidv4 } = require('uuid');
const { cartModel } = require("../dao/dataBase/models/cart.model");
const { cartService, productService, ticketService, userService } = require("../service/index.service");
const { winstonLogger } = require('../config/loggers');
const ticketsController = require('./tickets.controller');
const { sendPurchaseMail } = require('../utils/sendPurchaseMail');

require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class CartController {
    // GET que devuelve todos los carritos
    getCarts = async (req, res) => {
        try {
            let carts = await cartService.getCarts();
            res.status(200).send({
                status: "success",
                payload: carts
            });
        } catch (error) {
            res.status(400).send(error);
        }; 
    };

    // GET que muestra un carrito según su id
    getCartById = async (req, res) => {
        try {
            // Busco el carrito con esa id
            const { cid } = req.params;

            let cart = await cartService.getCartById(cid);

            if (!cart) {
                // return res.status(400).send({error: "No existe un producto con esa ID"});
                return res.render("404NotFound");
            };

            if (!req.session.user) {
                return res.redirect("/");
            };

            const cartProducts = cart.products;
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);
            
            let noCartProducts = false;
            let totalAmount;
            if (!cartProducts) {
                noCartProducts = true;
            } else {
                totalAmount = cartProducts.reduce((total, item) => {
                    return total + (item.product && item.product.price ? item.product.price : 0) * item.quantity;
                }, 0);
            }

            const productsWithoutStock = [];
            
            for (const item of cart.products) {
                if (item.product) {
                    const product = item.product;
                    const quantity = item.quantity;
                    const pid = item.product._id;
                    let stock = item.product.stock;
            
                    if (quantity > stock) {
                        productsWithoutStock.push(product);
                    }
                }
            };

            let allProductsWithStock = true;
            let noStock = false;
            if (productsWithoutStock.length > 0) {
                allProductsWithStock = false;
                noStock = true;
            };

            return res.render("individualCart", { user, cart, cartProducts, noCartProducts, totalAmount, allProductsWithStock, noStock });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // GET que muestra un carrito según la id de su dueño
    getCartByOwner = async (oid) => {
        try {
            // Busco el carrito con esa id    
            let result = await cartService.getCartByOwner(oid);

            return result;
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // POST que crea un carrito
    addCart = async (cartData, userId) => {
        try {
            let cart;
            if (cartData.body.products) {
                cart = cartData.body.products;
            } else {
                cart = [];
            }

            const newCart = {
                owner: userId,
                products: cart
            };
    
            let result = await cartService.addCart(newCart);
    
            return result;
        } catch (error) {
            winstonLogger.error(error);
        }
    };

    // POST que agregue un producto por id, a un carrito segun su id
    addProductByIdInCartById = async (req, res) => {
        try {
            // Busco el carrito con esa id
            const { cid, pid } = req.params;

            const quantity = 1;

            if (!req.session.user) {
                return res.redirect("/");
            };
            
            const productOwner = await productService.getProductById(pid);
            if (req.session.user.role === "premium" && productOwner.owner === req.session.user.email) {
                return res.status(400).send({error: "No podes agregar un producto que creaste!"});
            };

            // En caso de que el producto exista, incremento su cantidad
            const cartToUpdate = await cartService.addProductByIdInCartById(cid, pid, quantity);
            

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartService.getCartByOwner(user._id);

            // Obtengo el producto segun la id
            const product = await productService.getProductById(pid);

            let productAddedMoreThanOnce = false;
            if (cartToUpdate) {
                productAddedMoreThanOnce = true;
            } else {
                // En caso de que el producto NO exista
                await cartModel.findByIdAndUpdate(
                    {_id: cid},
                    {$push: {products: {product: pid, quantity: 1}}},
                    {new: true, upsert: true}
                );
            }

            return res.render("individualProduct", {user, cart, product});
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // PUT que actualiza el carrito con un array de productos
    updateCarts = async (req, res) => {
        try {
            const { cid } = req.params;
            const { products } = req.body;
    
            // Mapear el array de objetos para crear un nuevo array de subdocumentos completos
            const updatedProducts = products.map(({ product, quantity }) => ({ product, quantity }));
    
            let result = await cartService.updateCarts(cid, updatedProducts);
    
            res.send({
                status: "success",
                payload: result
            });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // PUT que actualiza la cantidad de un producto de un carrito segun su id
    updateCartById = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
    
            const cartToUpdate = await cartService.updateCartById(cid, pid, quantity);
    
            res.send({
                status: "success",
                payload: cartToUpdate
            });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // DELETE que borra un carrito segun su id
    deleteCartById = async (req, res) => {
        try {
            const {cid} = req.params;

            await cartService.deleteCartById(cid);
        } catch (error) {
            winstonLogger.error(error);
        }
    }


    // DELETE que borra los productos de un carrito segun su id
    deleteProductsCart = async (req, res) => {
        try {
            const { cid } = req.params;
    
            let result = await cartService.deleteProductsCart(cid);
    
            res.send({
                status: "success",
                payload: result
            });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // DELETE que borra un producto de un carrito segun su id
    deleteProductByIdInCartById = async (req, res) => {
        try {
            const { cid, pid } = req.params;
    
            let result = await cartService.deleteProductByIdInCartById(cid, pid);
    
            res.send({
                status: "success",
                payload: result
            });
        } catch (error) {
            winstonLogger.error(error);
        };

    };
    
    payment = async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
    
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);
    
            const lineItems = cart.products.map((item) => {
                return {
                    price_data: {
                        currency: 'ars', 
                        product_data: {
                            name: item.product.title,
                        },
                        unit_amount: item.product.price * 100,
                    },
                    quantity: item.quantity,
                };
            });

            // Genero un token único para que no pueda ingresarse al succesPayment, sin haber pagado
            function generateUniqueToken() {
                const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
                return token;
            }
            const uniqueToken = generateUniqueToken();
            cart.token = uniqueToken;
            await cart.save();
            
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                client_reference_id: cid,
                success_url: `https://saishaaccesorios.onrender.com//api/carts/${cid}/purchase?token=${cart.token}`,
                cancel_url: `https://saishaaccesorios.onrender.com//api/carts/${cid}`,
                // success_url: `http://localhost:8080/api/carts/${cid}/purchase?token=${cart.token}`,
                // cancel_url: `http://localhost:8080/api/carts/${cid}`
            });
    
            res.redirect(303, session.url);
        } catch (error) {
            winstonLogger.error(error);
        }
    };


    // POST que crea el ticket
    successPayment = async (req, res) => {
        try {
            const { cid } = req.params;
            const { token } = req.query

            // Verifico que el token generado en la compra sea el mismo que el de la url
            const cart = await cartService.getCartById(cid);
            if (!cart || cart.token !== token) {
                return res.render("404NotFound", {});
            }
            
            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            // Calculo el monto total de los productos
            const totalAmount = cart.products.reduce((total, item) => {
                return total + (item.product && item.product.price ? item.product.price : 0) * item.quantity;
            }, 0);

            // Guardo la fecha de realización de la compra
            const fecha = new Date();
            const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
            };
            const purchase_datetime = fecha.toLocaleString('es-ES', opciones);

            // Creo un codigo único
            function generateUniqueCode() {
                const code = Math.random().toString(36).substr(2) + Date.now().toString(36);
                return code;
            }
            const uniqueCode = generateUniqueCode()
            
            // Añado el ticket a la base de datos con sus productos, comprador y código correspondientes
            const ticketProducts = cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));
            
            const ticket = {
                purchaser: user._id,
                products: ticketProducts,
                amount: totalAmount,
                purchase_datetime: purchase_datetime,
                code: uniqueCode
            }
            
            await ticketsController.addTicket(ticket);

            // Modifico el stock de los productos comprados
            const productsToUpdate = [];
        
            for (const item of cart.products) {
                if (item.product) {
                    const product = item.product;
                    const quantity = item.quantity;
                    const pid = item.product._id;
                    let stock = item.product.stock;
            
                    if (quantity < stock) {
                        const updatedStock = stock - quantity;
                        productsToUpdate.push({ pid, stock: updatedStock });
                    }
                }
            };

            for (const product of productsToUpdate) {
                await productService.updateProductById(product.pid, { stock: product.stock });
            }
            
            // Borro el carrito y creo uno con una id distinta
            await cartService.deleteCartById(cid);

            const newCart = {
                owner: user._id,
                products: []
            };
    
            await cartService.addCart(newCart);

            // Envio un email con un link hacia el resumen de la compra
            sendPurchaseMail(uniqueCode, user.email);

            res.render("purchase", {user});        
        } catch (error) {
            winstonLogger.error(error);
        };
    };
};

module.exports = new CartController();