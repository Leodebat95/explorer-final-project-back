/* index --- esse arquivo serve somente pra unir todas as rotas da aplicação; 
             faz parte do contexto dos arquivos "routes (2º/5)" */


const { Router } = require('express');

const routes = Router();


const usersRouter = require('./users.routes');

const dishesRouter = require('./dishes.routes');

const tagsRouter = require('./tags.routes');

const sessionsRouter = require('./sessions.routes');


routes.use('/users', usersRouter);

routes.use('/dishes', dishesRouter);

routes.use('/tags', tagsRouter);

routes.use('/sessions', sessionsRouter);


module.exports = routes;
