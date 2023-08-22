const {Schema, model} = require("mongoose");

// Creo la colección en la que se almacenarán los documentos
const collection = "tickets";

// Configuro el esquema del ticket
const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    }
});

// Creo el modelo a traves del esquema
const ticketModel = model(collection, ticketSchema);

module.exports = {
    ticketModel
};
