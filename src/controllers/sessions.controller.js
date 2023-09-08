const mongoose = require('mongoose');
const { winstonLogger } = require('../config/loggers');
const { userModel } = require('../dao/dataBase/models/user.model');
const { cartService, userService } = require('../service/index.service');
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { CustomError } = require('../utils/CustomError/CustomError');
const { Error } = require('../utils/CustomError/Errors')
const { generateUserErrorInfo } = require('../utils/CustomError/info');
const { generateToken } = require("../utils/jwt");
const { sendResetMail } = require('../utils/sendResetMail');
const cartController = require("./carts.controller");
const userController = require("./users.controller");

const jwt = require('jsonwebtoken');
require("dotenv").config();

class SessionController {
    // Endpoint para registrarse
    registerSession = async (req, res, next) => {
        try {
            const { username, first_name, last_name, email, password, gender } = req.body;
    
            let missingInfo = false;
            let existingInfoEmail = false;
            let existingInfoUsername = false;
            let userCreated = false;
            
            // Validar que toda la información llegue
            if (!username || !first_name || !last_name || !email || !password || !gender) {
                missingInfo = true;
            } else {
                // Validar si ya existe el email o el nombre de usuario
                const existingEmail = await userService.getUserByEmail(email);
                const existingUsername = await userService.getUserByUsername(username);

                if (existingEmail) {
                    existingInfoEmail = true;
                } else if (existingUsername) {
                    existingInfoUsername = true;
                } else {
                    // Si no hay duplicados, crea el nuevo usuario
                    const newUser = {
                        username,
                        first_name,
                        last_name,
                        email,
                        role: "user",
                        password: createHash(password),
                        gender
                    };

                    // Creo el usuario y genero un token con sus datos
                    let resultUser = await userService.addUser(newUser);
                    let token = generateToken({
                        username: username,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        gender: gender
                    });

                    userCreated = true;
                };
            };
    
            res.render("register", { missingInfo, existingInfoEmail, existingInfoUsername, userCreated });
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    loginCookie = async (req, res) => {
        const {email, password} = req.body
    
        // Validar que el usuario exista en la base de datos o que sea el especifico para ser admin
        const userDB = await userService.getUserByEmail(email);

        if (!userDB) {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const access_token = generateToken({
                    username: "coderhouse",
                    first_name: "Coder",
                    last_name: "House",
                    email: email,
                    role: "admin",
                    gender: "none",
                    last_connection: Date()
                });
                
                return res
                .cookie('coderCookieToken', access_token,{
                    maxAge: 60*60*100,
                    httpOnly: true
                })
                .redirect("/api/products");
            };
        };

        // Validar que la contraseña ingresada sea la misma que la hasheada en la base de datos
        let missingInfo = false;
        if(!isValidPassword(password, userDB) || !userDB || !userDB.password) {
            // return res.status(401).send({
            //     status: "error",
            //     message: "El usuario o contraseña son incorrectos",
            // });
            missingInfo = true;
            return res.render("login", {missingInfo});
        };

        // Creo o actualizo el last_connection del user
        const fecha = new Date();

        await userService.updateUserById(userDB._id, {last_connection: fecha})

        // Creo el token, la sesión y la cookie con los datos del usuario
        const access_token = generateToken({
            username: userDB.username,
            first_name: userDB.first_name,
            last_name: userDB.last_name,
            email: userDB.email,
            role: userDB.role,
            gender: userDB.gender,
            last_connection: userDB.last_connection
        });

        req.session.user = {
            username: userDB.username,
            first_name: userDB.first_name,
            last_name: userDB.last_name,
            email: userDB.email,
            role: userDB.role,
            gender: userDB.gender,
            last_connection: userDB.last_connection
        };

        // Validación de si el usuario tiene un carrito
        const existingCart = await cartService.getCartByOwner(userDB._id);

        if (!existingCart) {
            // Si el usuario no tiene carrito, lo creo
            const cartData = { body: { products: [] } };
            await cartController.addCart(cartData, userDB._id);
        }

        res.cookie('coderCookieToken', access_token,{
            maxAge: 60*60*100,
            httpOnly: true
        })
        // .send({
        //     status: 'success',
        //     message: 'login success',
        //     role: userDB.role
        // });
        res.redirect("/api/products");
    };
    
    // Endpoint para ingresar con Github con passport
    githubCallback = async (req, res) => {
        req.session.user = req.user;

        const access_token = generateToken(req.user);
        
        res.cookie('coderCookieToken', access_token,{
            maxAge: 60*60*100,
            httpOnly: true
        }).redirect("/api/products");
    };

    // Endpoint para eliminar la sesion
    logoutSession = async (req, res) => {
        const username = req.session.user.username;
        const user = await userService.getUserByUsername(username);

        req.session.destroy(err => {
            if (err) {
                return res.send({status: "error", error: err});
            }
        });

        // Actualizo el last_connection del user
        const fecha = new Date();
        const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
        };
        const last_connection = fecha.toLocaleString('es-ES', opciones);

        await userService.updateUserById(user._id, {last_connection: last_connection})

        res.redirect("/");
    };

    forgotPassword = async (req, res) => {
        const { email } = req.body;

        let noUser = false;
        let emailSent = false;

        // Encontrar el usuario por correo electrónico
        const userDB = await userService.getUserByEmail(email);

        if (!userDB) {
            noUser = true;
            return res.render("forgotPassword", {noUser});
        };    

        // Enviar el email de recuperacion al usuario
        sendResetMail(email);
        emailSent = true;

        // res.status(200).json({status: 'success', message:'Email de recuperación enviado correctamente'});
        res.render("forgotPassword", {emailSent});
    };

    resetPassword = async (req, res) => {
        const { token } = req.query;
        const { password } = req.body;

        try {
            // Vericar el JWT token
            const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            const { email } = decodedToken;

            let noToken = false;
            let noPassword = false;
            let actualPassword = false;
            let passwordModified = false;

            // Encontrar si el usuario está creado
            const userDB = await userService.getUserByEmail(email);

            if (!userDB) {
                noToken = true;
                return res.render("resetPassword", {token, noToken});
            };

            // Verifico que la contraseña sea colocada
            if (!password) {
                noPassword = true;
                return res.render("resetPassword", {token, noPassword});
            };

            // Verifico que la contraseña no sea la misma que la actual
            if (isValidPassword(password, userDB)) {
                actualPassword = true;
                return res.render("resetPassword", {token, actualPassword});            
            };

            // Actualizar la contraseña
            userDB.password = createHash(password);
            await userDB.save();

            passwordModified = true;

            res.render("resetPassword", {passwordModified}); 
        } catch (err) {
            // En caso de que el token ya no exista, redirecciono a la pagina de recuperación
            if (err instanceof jwt.TokenExpiredError) {
                const noToken = true;
                return res.render("resetPassword", {noToken});
            } else {
                winstonLogger.error(err);
            };
        };
    };

    roleValidator = async (req, res) => {
        const cookie = req.cookies["coderCookieToken"];
        
        require('dotenv').config();
        let privateKey = process.env.JWT_PRIVATE_KEY;
        const user = jwt.verify(cookie, privateKey);
        
        if(user) {
            return res.send({status: "success", payload: user});
        };
    };
};

module.exports = new SessionController();