// routes (2º/5) --- arquivo por onde as requisições são endereçadas


const { Router } = require('express');

const dishesRoutes = Router();


const multer = require('multer');

const uploadConfig = require('../configs/upload');


const DishesController = require('../controllers/DishesController');

const dishesController = new DishesController();


const DishPictureController = require('../controllers/DishPictureController');

const dishPictureController = new DishPictureController();

const upload = multer(uploadConfig.MULTER);


const ensureAdmin = require('../middlewares/ensureAdmin');

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

dishesRoutes.use(ensureAuthenticated);


dishesRoutes.get('/', dishesController.showAll);

dishesRoutes.get('/:id', dishesController.showDish);

dishesRoutes.patch('/:id', dishesController.updateLike);

dishesRoutes.post('/', ensureAdmin, dishesController.create);

dishesRoutes.put('/:id', ensureAdmin, dishesController.update);

dishesRoutes.delete('/:id', ensureAdmin, dishesController.delete);

dishesRoutes.patch('/:id/picture', ensureAdmin, upload.single('picture'), dishPictureController.update);


module.exports = dishesRoutes;
