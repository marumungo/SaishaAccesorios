const { winstonLogger } = require("../config/loggers");

const errorHandler = (error, req, res, next) => {
    winstonLogger.info(error.cause);
    switch (error.code) {
        case Error.ROUTING_ERROR:
            return res.send({status: "error", error: error.name});
            break;

        case Error.INVALID_TYPE_ERROR:
            return res.send({status: "error", error: error.name});
            break;

        case Error.DATABASE_ERROR:
            return res.send({status: "error", error: error.name});
            break;

        default: 
            return res.send({status: "error", error: "Unhandled error"});
            break;
    };
};

module.exports = {
    errorHandler
};