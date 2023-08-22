const { Router } = require("express");

const router = Router();

// Declaro a los Routers
const cartsRouter = require("./carts.router");
const productsRouter = require("./products.router");
const viewsRouter = require("./views.router");
const usersRouter = require("./users.router");
const ticketsRouter = require("./tickets.router");
const sessionsRouter = require("./sessions.router");

// Llamo a los Routers y coloco los endpoint de inicio
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/users", usersRouter);
router.use("/api/tickets", ticketsRouter);
router.use("/api/sessions", sessionsRouter);

router.use("/", viewsRouter);


module.exports = router;