const { ticketModel } = require("./models/ticket.model");

class TicketDaoDataBase {
    async addTicket(ticket) {
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            return new Error(error);
        }
    }
};

module.exports = TicketDaoDataBase;