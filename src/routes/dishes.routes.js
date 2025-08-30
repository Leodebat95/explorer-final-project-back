// routes (2º/5) --- arquivo por onde as requisições são endereçadas


const { Router } = require('express');

const DishesController = require('../controllers/DishesController');

const dishesController = new DishesController();

const dishesRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');


dishesRoutes.use(ensureAuthenticated);


dishesRoutes.post('/', dishesController.create);

dishesRoutes.get('/', dishesController.showAll);

dishesRoutes.get('/:id', dishesController.showDish);

dishesRoutes.put('/:id', dishesController.update);

dishesRoutes.delete('/:id', dishesController.delete);


module.exports = dishesRoutes;
