// controllers (3º/5)


const knex = require('../database/knex');

const AppError = require('../utils/AppError');

const { compare } = require('bcryptjs');

const authConfig = require('../configs/auth');

const { sign } = require('jsonwebtoken');



class SessionsController {

  async create(request, response) {
    
    const { email, password } = request.body;

    const user = await knex('users').where({ email }).first();
    
    if(!user) {
      throw new AppError('E-mail e/ou senha incorreta', 401);
    };

    const passwordMatched = await compare(password, user.password);
    
    if(!passwordMatched) {
      throw new AppError('E-mail e/ou senha incorreta', 401);
    };
    
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        user_type: user.user_type
      },
      secret,
      {
        subject: String(user.id),
        expiresIn
      }
    );

    delete user.password;

    return response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type
      },
      token
    });
  };
};


module.exports = SessionsController;
