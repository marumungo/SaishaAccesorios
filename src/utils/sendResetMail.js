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

const generateResetPasswordLink = (email) => {
    const token = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });
    // return `http://localhost:8080/api/sessions/resetPassword?token=${token}`;
    return `https://saishaaccesorios.onrender.com/api/sessions/resetPassword?token=${token}`;
};

exports.sendResetMail = async (destino) => {
    const resetPasswordLink = generateResetPasswordLink(destino);
    const imageSrc = "https://i.postimg.cc/qRgmLfN9/logo.jpg"
    const html = `
        <style>
            body {
                font-family: 'Montserrat', sans-serif;
            }
        </style>
        <img src="${imageSrc}" alt="logo" style="width: 20%">
        <h1>Hola! Olvidaste tu contraseña?</h1>
        <p>Accedé al siguiente link para recuperarla:</p>
        <a href="${resetPasswordLink}">Restablecer aqui!</a>
        <p>Por seguridad, este link es válido por una hora</p>
        <p>Saisha accesorios<p>`;

    return await transport.sendMail({
        from: 'Ecommerce <ecommerce.pruebas.backend@gmail.com>',
        to: destino,
        subject: "Restablecer contraseña!",
        html
    });
};
