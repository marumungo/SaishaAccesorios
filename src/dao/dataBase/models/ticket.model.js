const {Schema, model} = require("mongoose");

// Creo la colección en la que se almacenarán los documentos
const collection = "tickets";

// Configuro el esquema del ticket
const ticketSchema = new Schema({
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true
    }
});

// Creo el modelo a traves del esquema
const ticketModel = model(collection, ticketSchema);

module.exports = {
    ticketModel
};
