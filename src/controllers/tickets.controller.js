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