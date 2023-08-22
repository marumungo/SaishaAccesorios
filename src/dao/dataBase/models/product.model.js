const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Creo la colección en la que se almacenarán los documentos
const collection = "products";

// Configuro el esquema del producto
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        default: "admin"
    }
});

productSchema.plugin(mongoosePaginate);

// Creo el modelo a traves del esquema
const productModel = model(collection, productSchema);

module.exports = {
    productModel
};