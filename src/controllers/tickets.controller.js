const { winstonLogger } = require("../config/loggers");
const { ticketModel } = require("../dao/dataBase/models/ticket.model");

class TicketController {
    // GET que muestra los tickets de la coleccion
    getTickets = async (req, res) => {
        try {
            let result = await ticketModel.find();
    
            res.send({
                status: "success",
                payload: result
            });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // POST que añade tickets a la coleccion
    addTicket = async (req, res) => {
        try {
            const ticket = await ticketModel.create(req.body);
    
            res.send({
                status: "success",
                payload: ticket
            });
        } catch (error) {
            winstonLogger.error(error);
        }
    }
};

module.exports = new TicketController();