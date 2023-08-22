const {connect} = require('mongoose')
const dotenv = require('dotenv')
const { commander } = require('../utils/commander');
const { MongoSingleton } = require('../utils/singleton');
const { winstonLogger } = require('./loggers');

const { mode } = commander.opts()
dotenv.config({
    path: mode === 'development' ? './.env.development': './.env.production' 
});

let port = process.env.PORT;
let persistence = process.env.PERSISTENCE;

let gmailUserApp = process.env.GMAIL_USER_APP;
let gmailPassApp = process.env.GMAIL_PASS_APP;

let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
let myPhoneNumber = process.env.MY_PHONE_NUMBER;

// Configuro la base de datos para que se conecte con la nube
let url = process.env.MONGO_URL;

module.exports = {
    persistence: persistence,
    port: port,
    gmail_user_app: gmailUserApp,
    gmail_pass_app: gmailPassApp,
    twilio_account_sid: twilioAccountSid,
    twilio_auth_token: twilioAuthToken,
    twilio_phone_number: twilioPhoneNumber,
    my_phone_number: myPhoneNumber,
    // connectDB: () => {
    //     connect(url);
    //      winstonLogger.info("Base de datos conectada");
    // }
    connectDB: async () => await MongoSingleton.getInstance()
};