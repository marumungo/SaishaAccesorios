const { Router } = require("express");
const { getProducts, getProductById, addProduct, updateProductById, deleteProductById } = require('../controllers/products.controller');
const { authorization } = require("../passport-jwt/authorizationJwtRole");
const { passportCall } = require("../passport-jwt/passportCall");
const { userService } = require("../service/index.service");
const cartsController = require("../controllers/carts.controller");

const router = Router();

// GET en el que se verán todos los productos
router.get("/", getProducts);

// POST que agrega nuevos productos al array
router.post("/", passportCall("jwt"), authorization("admin", "premium"), addProduct);
// router.post("/", addProduct);

router.get("/addProduct", async (req, res) => {
    const username = req.session.user.username;
    const user = await userService.getUserByUsername(username);

    const cart = await cartsController.getCartByOwner(user._id);

    res.render("addProduct", {user, cart});
});

// GET que devuelve un producto a partir de su id
router.get("/:id", getProductById);

// PUT que actualiza un producto según su id
router.put("/:id", passportCall("jwt"), authorization("admin"), updateProductById);
// router.put("/:id", updateProducts);

// DELETE que elimina un producto según su id
router.delete("/:id", passportCall("jwt"), authorization("admin"), deleteProductById);
// router.delete("/:id", deleteProducts);

module.exports = router;