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

exports.sendUserDeletedMail = async (destino) => {
    const imageSrc = "https://i.postimg.cc/qRgmLfN9/logo.jpg"
    const html = `
        <style>
            body {
                font-family: 'Montserrat', sans-serif;
            }
        </style>
        <img src="${imageSrc}" alt="logo" style="width: 20%">
        <h1>Hola! Tu usuario ha sido eliminado</h1>
        <p>Debido a tu inactividad, decidimos cerrar tu cuenta. No te hagas problema, podrás crearla nuevamente cuando lo desees!</p>
        <p>Saisha accesorios<p>`;

    return await transport.sendMail({
        from: 'Ecommerce <ecommerce.pruebas.backend@gmail.com>',
        to: destino,
        subject: "Usuario eliminado!",
        html
    });
};
