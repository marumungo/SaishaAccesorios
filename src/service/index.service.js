const { ProductDao, UserDao, CartDao, TicketDao } = require("../dao/factory");
const CartRepository = require("../repositories/carts.repository");
const ProductRepository = require("../repositories/products.repository");
const TicketRepository = require("../repositories/ticket.repository");
const UserRepository = require("../repositories/user.repository");

const productService = new ProductRepository(new ProductDao());
const userService = new UserRepository(new UserDao());
const cartService = new CartRepository(new CartDao());
const ticketService = new TicketRepository(new TicketDao());

module.exports = {
    productService,
    userService,
    cartService,
    ticketService
};