const {Router} = require("express");
const {auth} = require("../middlewares/authentication.middleware");
const passport = require("passport");
const { passportCall } = require("../passport-jwt/passportCall");
const { authorization } = require("../passport-jwt/authorizationJwtRole");
const { registerSession, loginSession, loginCookie, registerPassport, loginPassport, registerPassportEscape, loginPassportEscape, githubCallback, privateAdmin, logoutSession, forgotPassword, resetPassword, sessionCounter, roleValidator } = require("../controllers/sessions.controller");
const { authToken } = require("../utils/jwt");

const router = Router();

// SESSION
// Endpoint para registrarse
router.post("/register", registerSession);

// Endpoint para iniciar sesion
router.post('/login', loginCookie);

// Validar el rol
router.get('/current', passportCall("jwt"), authorization('admin'), roleValidator);

// Endpoint para ingresar con Github con passport
router.get("/github", passport.authenticate("github", {scope: ["user: email"]}));

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/api/sessions/login"}), githubCallback);

// Endpoint para eliminar la sesion
router.get("/logout", logoutSession);

// Endpoint para recuperar la contraseña
router.post('/forgotPassword', forgotPassword);

// Endpoint para restaurar la contraseña
router.post('/resetPassword', resetPassword);


module.exports = router;