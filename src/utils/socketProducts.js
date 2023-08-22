const { winstonLogger } = require("../config/loggers");
const ProductDaoFile = require("../dao/file/productFile");

const productDao = new ProductDaoFile();

const socketProducts = async (io) => {
    const products = await productDao.getProducts();

    io.on("connection", socket => {
        winstonLogger.info("Nuevo cliente conectado");

        socket.emit("products", products);

        socket.on("addProduct", data => {
            winstonLogger.info(data);
            productDao.addProduct(data);
        })
    });
};

module.exports = {
    socketProducts
};