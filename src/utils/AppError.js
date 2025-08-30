/* utils (4º/5) --- parte responsável por tratar exceções e erros da aplicação;
                    esse arquivo serve pra padronizar a mensagem 
                    que aparecerá quando ocorrerem exceções */

class AppError {

  message;
  statusCode;

  constructor(message, statusCode = 400) {
    
    this.message = message;
    this.statusCode = statusCode;
  };
};


module.exports = AppError;
