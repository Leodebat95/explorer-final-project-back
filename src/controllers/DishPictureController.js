// controllers (3º/5)

const knex = require('../database/knex');

const DiskStorage = require('../providers/DiskStorage');


class DishPictureController {

  // **AJUSTAR MELHOR DEPOIS
  async create(request, response) {

    const { dish_id } = request.body;

    const dishFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex('dishes')
      .where({ id: dish_id }).first();
    
    if(dish.picture) {

      await diskStorage.deleteFile(dish.picture);
    };
    
    const filename = await diskStorage.saveFile(dishFilename);
    dish.picture = filename;
    
    await knex('dishes').update(dish).where({ id: dish_id });

    return response.json(dish);
  };


  async update(request, response) {

    const { dish_id } = request.body;
    
    const dishFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex('dishes')
      .where({ id: dish_id }).first();
    
    if(dish.picture) {

      await diskStorage.deleteFile(dish.picture);
    };
    
    const filename = await diskStorage.saveFile(dishFilename);
    dish.picture = filename;
    
    await knex('dishes').update(dish).where({ id: dish_id });

    return response.json(dish);
  };
};


module.exports = DishPictureController;
