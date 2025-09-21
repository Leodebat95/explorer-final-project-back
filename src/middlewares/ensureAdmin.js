// ensureAdmin --- arq. que serve pra garantir o usuário administrador


const AppError = require('../utils/AppError');


function ensureAdmin(request, response, next) {

  const { user } = request;

  const userType = user.user_type;

  if(userType !== 'admin') {

    throw new AppError('Acesso restrito para administradores', 403);
  };

  return next();
};


module.exports = ensureAdmin;
