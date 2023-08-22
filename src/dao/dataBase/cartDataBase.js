const { cartModel } = require("./models/cart.model");
const { ticketModel } = require("./models/ticket.model");

class CartDaoDataBase {
    async getCarts() {
        try {
            return await cartModel.find({});
        } catch (error) {
            return new Error(error);
        }
    }
    async getCartById(cid) {
        try {
            return await cartModel.findOne({_id: cid});
        } catch (error) {
            return new Error(error);
        }
    }
    async getCartByOwner(oid) {
        try {
            return await cartModel.findOne({ owner: oid });
        } catch (error) {
            return new Error(error);
        }
    }
    async addCart(cart) {
        try {
            return await cartModel.create(cart);
        } catch (error) {
            return new Error(error);
        }
    }

    async addProductByIdInCartById(cid, pid, quantity) {
        try {
            return await cartModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": 1}}, {new: true});
        } catch (error) {
            return new Error(error);
        }
    }

    async updateCarts(cid, updatedProducts) {
        try {
            return await cartModel.findOneAndUpdate({ _id: cid }, { $set: { products: updatedProducts } }, { new: true });
        } catch (error) {
            return new Error(error);
        }
    }

    async updateCartById(cid, pid, quantity) {
        try {
            return await cartModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$set: {"products.$.quantity": quantity}}, {new: true});
        } catch (error) {
            return new Error(error);
        }
    }

    async deleteProductsCart(cid) {
        try {
            return await cartModel.findOneAndUpdate({_id: cid}, {$set: {products: {}}}, {new: true});
        } catch (error) {
            return new Error(error);
        }
    }

    async deleteProductByIdInCartById(cid, pid) {
        try {
            return await cartModel.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}}, {new: true});
        } catch (error) {
            return new Error(error);
        }
    }

    async addTicket(ticket) {
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            return new Error(error);
        }
    }
};

module.exports = CartDaoDataBase;