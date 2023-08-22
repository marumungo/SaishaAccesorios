const { winstonLogger } = require("../config/loggers");

const addLogger = (req, res, next) => {
    req.logger = winstonLogger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

module.exports = {
    addLogger
};