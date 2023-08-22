const { Router } = require("express");
const { userService } = require("../service/index.service");
const cartsController = require("../controllers/carts.controller");

const router = Router();

//SESSIONS
// Declaro el endpoint que renderizará la página de inicio
router.get("/", (req, res) => {
    res.render("login", {});
});

// Declaro el endpoint que renderizará la página de login
router.get("/api/sessions/login", (req, res) => {
    res.render("login", {});
});

// Declaro el endpoint que renderizará la página de register
router.get("/api/sessions/register", (req, res) => {
    res.render("register", {});
});

// Declaro el endpoint que renderizará la página de forgotPassword
router.get("/api/sessions/forgotPassword", (req, res) => {
    res.render("forgotPassword", {});
});

// Declaro el endpoint que renderizará la página de resetPassword
router.get("/api/sessions/resetPassword", (req, res) => {
    res.render("resetPassword", { token: req.query.token });
});

// Declaro el endpoint que renderizará la página de documents
router.get("/api/users/:uid/documents", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    // Obtengo los datos del usuario que inició sesión
    const username = req.session.user.username;
    const user = await userService.getUserByUsername(username);

    const cart = await cartsController.getCartByOwner(user._id);

    res.render("documents", {user, cart});
});


// Declaro el endpoint de páginas no existentes
router.get("*", async (req, res) => {
    // res.status(404).send("404 not found");
    res.render("404NotFound", {})
});

module.exports = router;