const {connect} = require('mongoose');
const { winstonLogger } = require('../config/loggers');

class MongoSingleton {
    static #instance;
    constructor(){
        // winstonLogger.info(process.env.MONGO_URL);
        connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    };

    static getInstance(){
        if (this.#instance) {
            winstonLogger.info("Base de datos ya está creada");
            return this.#instance;
        };

        this.#instance = new MongoSingleton()
        winstonLogger.info("Base de datos creada");
        return this.#instance;
    };
};

module.exports = {
    MongoSingleton
};
