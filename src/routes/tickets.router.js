const fs = require('fs');
const { Router } = require("express");
const { getTickets, getBySize, addTicket } = require('../controllers/tickets.controller');

// Declaro y llamo al Router
const router = Router();

// GET que muestra las ordenes de la coleccion
router.get("/", getTickets);

module.exports = router;