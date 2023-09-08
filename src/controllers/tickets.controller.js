const { winstonLogger } = require("../config/loggers");
const { ticketModel } = require("../dao/dataBase/models/ticket.model");
const { userService, productService, cartService } = require("../service/index.service");

class TicketController {
    // GET que muestra los tickets de la coleccion
    getTickets = async (req, res) => {
        try {
            const tickets = await ticketModel.find();

            if (!tickets) {
                return res.render('404NotFound', {});
            } 

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartService.getCartByOwner(user._id);
            
            // Si no hay tickets, renderizo el noTickets
            let noTickets = false;
            if (tickets.length === 0) {
                noTickets = true;
            }
            
            // Creo un array que almacenará los datos necesarios de cada ticket
            const ticketsData = [];
            
            for (const ticket of tickets) {
                // Obtengo el id de los purchaser y los busco para obtener sus emails
                const purchaser = await userService.getUserById(ticket.purchaser);
                const purchaserEmail = purchaser ? `${purchaser.email}` : 'Unknown Purchaser';

                // Mapeo los productos para obtener la id y la cantidad de cada uno
                const buyedProducts = [];

                for (const productInfo of ticket.products) {
                    const product = await productService.getProductById(productInfo.product);

                    if (product) {
                        // Si se encuentra el producto, agrega su título y cantidad al arreglo
                        buyedProducts.push({
                            title: product.title,
                            quantity: productInfo.quantity
                        });
                    }
                }

                // Agrega los datos del ticket a un arreglo de objetos
                ticketsData.push({
                    purchaser: purchaserEmail,
                    products: buyedProducts,
                    amount: ticket.amount,
                    purchase_datetime: ticket.purchase_datetime
                });
            }

            res.render('tickets', { user, cart, ticketsData, noTickets });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // GET que muestra un ticket segun su id
    getTicketByCode = async (req, res) => {
        try {
            const {code} = req.params;

            const ticket = await ticketModel.findOne({code: code})

            if (!ticket) {
                return res.render('404NotFound', {});
            } 

            const purchaser = await userService.getUserById(ticket.purchaser);
            const purchaserName = purchaser.first_name + " " + purchaser.last_name;

            // Mapea los productos para obtener la ID y la cantidad de cada uno
            const buyedProducts = [];
            for (const productInfo of ticket.products) {
                const product = await productService.getProductById(productInfo.product);
                if (product) {
                    // Si se encuentra el producto, agrega su título y cantidad al arreglo
                    buyedProducts.push({
                        title: product.title,
                        quantity: productInfo.quantity
                    });
                }
            }

            res.render('individualTicket', { ticket, purchaserName, buyedProducts });
        } catch (error) {
            winstonLogger.error(error);
        }
    }

    // POST que añade tickets a la coleccion
    addTicket = async (ticket) => {
        try {
            const result = await ticketModel.create(ticket);
            return result;
        } catch (error) {
            winstonLogger.error(error);
        }
    }
};

module.exports = new TicketController();