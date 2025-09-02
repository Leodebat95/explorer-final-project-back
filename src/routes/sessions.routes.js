// routes (2º/5) --- arquivo por onde as requisições são endereçadas

const { Router } = require('express');

const SessionsController = require('../controllers/SessionsController');

const sessionsController = new SessionsController();

const sessionsRoutes = Router();


sessionsRoutes.post('/', sessionsController.create);


module.exports = sessionsRoutes;
