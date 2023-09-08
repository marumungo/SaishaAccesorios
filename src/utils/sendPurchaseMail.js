const nodemailer = require('nodemailer');
const config = require('../config/objectConfig');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmail_user_app,
        pass: config.gmail_pass_app
    }
});

exports.sendPurchaseMail = async (uniqueCode, destino) => {
    // const purchaseLink = `http://localhost:8080/api/tickets/${uniqueCode}`;
    const purchaseLink = `https://saishaaccesorios.onrender.com/api/tickets/${uniqueCode}`;

    const imageSrc = "https://i.postimg.cc/qRgmLfN9/logo.jpg"
    const html = `
        <style>
            body {
                font-family: 'Montserrat', sans-serif;
            }
        </style>
        <img src="${imageSrc}" alt="logo" style="width: 20%">
        <h1>Hola! Muchas gracias por tu compra!</h1>
        <p>Te dejamos un link para que puedas ver el resumen de la misma.</p>
        <a href="${purchaseLink}">Ver tu compra!</a>
        <p>Saisha accesorios<p>`;

    return await transport.sendMail({
        from: 'Ecommerce <ecommerce.pruebas.backend@gmail.com>',
        to: destino,
        subject: "Compra realizada!",
        html
    });
};