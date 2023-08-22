const cluster = require('cluster');
const {cpus}  = require('os');
const { winstonLogger } = require('./config/loggers');
const { initServer } = require('./server');

// Cantidad de hilos dentro de mi procesador
// winstonLogger.info(cluster.isPrimary);
const numeroDeProcesadores = cpus().length;
// console.log('cantidad de hilos de ejecución de mi procesador: ', numeroDeProcesadores);
// console.log(cpus());


// if (cluster.isPrimary) {
//         winstonLogger.info('Proceso primario, generando processo trabajador');
//         for (let i = 0; i < numeroDeProcesadores; i++) {
//                 cluster.fork()   ;     
//         };
//         cluster.on('message', worker => {
//                 winstonLogger.info(`El worker ${worker.process.id} dice ${worker.message}`);
//         });
// } else {
//         winstonLogger.info('al no ser un proceso forkeado, no cuento como primario por lo tanto isPrimari en false, soy un worker');
//         initServer();
// };

initServer();