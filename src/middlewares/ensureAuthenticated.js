// ensureAuthenticated --- arq. que serve pra garantir a autenticação


const { verify } = require('jsonwebtoken');

const AppError = require('../utils/AppError');

const authConfig = require('../configs/auth');



function ensureAuthenticated(request, response, next) {

  const authHeader = request.headers.authorization;

  if(!authHeader) {
    throw new AppError('JWT Token não informado', 401);
  };
  
  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(decoded.sub),
      user_type: decoded.user_type
    };

    return next();

  } catch {
    throw new AppError('JWT Token inválido', 401);
  };
};


module.exports = ensureAuthenticated;
