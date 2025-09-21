// routes (2º/5) --- arquivo por onde as requisições são endereçadas


const { Router } = require('express');

const TagsController = require('../controllers/TagsController');

const tagsController = new TagsController();

const tagsRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');


tagsRoutes.get('/', ensureAuthenticated, tagsController.index);


module.exports = tagsRoutes;
