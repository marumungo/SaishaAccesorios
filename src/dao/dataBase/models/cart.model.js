const {Schema, model} = require("mongoose");

// Creo la colección en la que se almacenarán los documentos
const collection = "carts";

// Configuro el esquema del carrito
const cartSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

// Coloco el populate para que se vea a partir del id de referencia, el producto completo
cartSchema.pre("findOne", function() {
    this.populate("products.product");
});

// Creo el modelo a traves del esquema
const cartModel = model(collection, cartSchema);

module.exports = {
    cartModel
};