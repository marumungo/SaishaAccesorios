const winston = require('winston');
const { commander } = require('../utils/commander');

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: 'http'}),
//         new winston.transports.File({filename: './errors.log', level: 'warn'})
//     ]
// });


const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'pink',
        debug: 'white' 
    }
};

const { mode } = commander.opts();
let winstonLogger;

if (mode === "development") {
    winstonLogger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelOptions.colors}),
                        winston.format.simple()
                    )
                })
            ]
    });
} else if (mode === "production") {
    winstonLogger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize({colors: customLevelOptions.colors}),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: './errors.log',
                    level: 'warning',
                    format: winston.format.simple()
                })
            ]
    });
};

winstonLogger.info(mode);

module.exports = {
    winstonLogger
};
