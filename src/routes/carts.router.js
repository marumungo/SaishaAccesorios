const { Router } = require("express");
const { getCarts, getCartById, addCart, addProductByIdInCartById, updateCarts, updateCartById, deleteProductByIdInCartById, deleteProductsCart, addTicket, payment, successPayment } = require("../controllers/carts.controller");
const { authorization } = require("../passport-jwt/authorizationJwtRole");
const { passportCall } = require("../passport-jwt/passportCall");

const path = "./manager/carts.json";

// Declaro y llamo al Router
const router = Router();

// GET que devuelve todos los carritos
router.get("/", getCarts);

// GET que muestra un carrito según su id
router.get("/:cid", getCartById);

// POST que crea un carrito
router.post("/", addCart);

// POST que agregue un producto por id, a un carrito segun su id
// router.post("/:cid/product/:pid", passportCall("jwt"), authorization("user", "admin"), addCartById);
router.post("/:cid/product/:pid", addProductByIdInCartById);

// PUT que actualiza el carrito con un array de productos
router.put("/:cid", updateCarts);

// PUT que actualiza la cantidad de un producto de un carrito segun su id
router.put("/:cid/product/:pid", updateCartById);

// DELETE que borra los productos de un carrito segun su id
router.delete("/:cid", deleteProductsCart);

// DELETE que borra un producto de un carrito segun su id
router.delete("/:cid/product/:pid", deleteProductByIdInCartById);

// GET que renderiza la página del payment
router.post("/:cid/payment", payment);

// POST que crea el ticket
router.get("/:cid/purchase", successPayment);

module.exports = router;