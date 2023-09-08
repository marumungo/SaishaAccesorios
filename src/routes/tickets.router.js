const { Router } = require("express");
const { getTickets, getTicketByCode } = require('../controllers/tickets.controller');
const { passportCall } = require('../passport-jwt/passportCall');
const { authorization } = require('../passport-jwt/authorizationJwtRole');

// Declaro y llamo al Router
const router = Router();

// GET que muestra las ordenes de la coleccion
router.get("/", passportCall("jwt"), authorization("admin"), getTickets);

// GET que muestra un ticket segun su id
router.get("/:code", getTicketByCode);

module.exports = router;