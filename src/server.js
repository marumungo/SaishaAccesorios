const express = require("express");
// const FileStore = require("session-file-store");
const logger = require("morgan");

// Llamo a express
const app = express();

// Declaro el puerto en el que se ejecutará el código, utilizando socket.io
const objectConfig = require("./config/objectConfig");


const { Server: ServerHTTP } = require('http');
const { Server: ServerIO } = require('socket.io');

const serverHttp = new ServerHTTP(app);
const io = new ServerIO(serverHttp);

// Ejecuto la configuracion de la base de datos
objectConfig.connectDB();

// Configuro handlebars
const handlebars = require("express-handlebars");

const path = require('path');
const hbs = handlebars.create({ defaultLayout: "main" });

hbs.handlebars.registerHelper('getProperty', (object, propertyName) => {
    return object[propertyName];
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


// Lectura de código compatible
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use("/static", express.static(__dirname + "/public"));
app.use(logger("dev"));

// Llamo a cookie-parser y a session
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Llamo al logger
const { addLogger } = require("./middlewares/logger.middleware");

app.use(addLogger);

// Llamo y configuro swagger
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de e-commerce',
            description: 'Esta es la documentación del e-commerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const { create } = require("connect-mongo");

let url = process.env.MONGO_URL;

app.use(session({
    store: create ({
        mongoUrl: url,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 10000 * 60
    }),

    secret: "palabraSecreta",
    resave: true,
    saveUninitialized: true
}));

// Configuro passport
const { initPassportGithub } = require("./config/passportConfig");
const passport = require("passport");
const {initPassport} = require("./passport-jwt/passportConfig");

initPassport();
initPassportGithub();
passport.use(passport.initialize());

app.use(cookieParser("palabra secreta"));

// Llamo a las funciones de socket (en utils)
const { socketProducts } = require("./utils/socketProducts");

socketProducts(io);


// Llamo al archivo que contiene los Routers
const routerServer = require("./routes/index.router");

app.use(routerServer);

// LLamo al manejador de errores
const { errorHandler } = require("./middlewares/error.middleware");

app.use(errorHandler);


const PORT = objectConfig.port;

const { winstonLogger } = require("./config/loggers");
exports.initServer = () => serverHttp.listen(PORT,()=>{
    winstonLogger.info(`Escuchando en el puerto: ${PORT}`);
});