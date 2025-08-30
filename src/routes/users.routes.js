// routes (2º/5) --- arquivo por onde as requisições são endereçadas


const { Router, request, response } = require('express');

const multer = require('multer');

// apagar
const uploadConfig = require('../configs/upload');

const UsersController = require('../controllers/UsersController');

const usersController = new UsersController();


// apagar
const UserAvatarController = require('../controllers/UserAvatarController');

// apagar
const userAvatarController = new UserAvatarController();


const usersRoutes = Router();

// apagar
const upload = multer(uploadConfig.MULTER);

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');



usersRoutes.post('/', usersController.create);

// apagar
usersRoutes.put('/', ensureAuthenticated, usersController.update)

// apagar
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update)


module.exports = usersRoutes;
