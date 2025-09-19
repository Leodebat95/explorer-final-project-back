// controllers (3º/5)

const knex = require('../database/knex');

const DiskStorage = require('../providers/DiskStorage');



class DishPictureController {

  async update(request, response) {

    const diskStorage = new DiskStorage();
    
    const dishFilename = request.file.filename;

    const { id } = request.params;

    const dish = await knex('dishes')
      .where({ id }).first();
    
    
    if(dish.picture) {

      await diskStorage.deleteFile(dish.picture);
    };
    
    const filename = await diskStorage.saveFile(dishFilename);
    
    await knex('dishes').where({ id }).update({
      picture: filename
    });

  
    const updatedDish = await knex('dishes')
      .where({ id }).first();

    return response.json(updatedDish);
  };
};


module.exports = DishPictureController;
