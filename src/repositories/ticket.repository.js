class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    };

    addTicket = async (ticket) => {
        let result = await this.dao.addTicket(ticket);
        return result;
    }
};

module.exports = TicketRepository;