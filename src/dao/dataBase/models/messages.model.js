const {Schema, model} = require("mongoose");

// Creo la colección en la que se almacenarán los documentos
const collection = "messages";

// Configuro el esquema del mensaje
const messageSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
});

// Creo el modelo a traves del esquema
const messageModel = model(collection, messageSchema);

module.exports = {
    messageModel
};