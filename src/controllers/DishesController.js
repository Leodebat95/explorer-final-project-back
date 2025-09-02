// controllers (3º/5)

const knex = require("../database/knex");

const sqliteConnection = require('../database/sqlite');



class DishesController {

	async create(request, response) {

		const { title, category, description, price, like, tags } = request.body;
		const user_id = request.user.id;

		const [dish_id] = await knex('dishes').insert({
			title,
			category,
			description,
			price,
			like,
			user_id
		});

		const tagsInsert = tags.map(name => {
			return {
				dish_id,
				name,
				user_id
			};
		});

		await knex('tags').insert(tagsInsert);

		return response.json();
	};


	async showAll(request, response) {

		const { title, tags } = request.query;

		const user_id = request.user.id;

		let dishes;

		if(tags) {

			const filterTags = tags.split(',').map(tag => tag.trim());

			dishes = await knex('tags')
				.select([
					"dishes.id",
					"dishes.title",
					"dishes.user_id"
				])
				.where('dishes.user_id', user_id)
				.whereLike('dishes.title', `%${title}%`)
				.whereIn('name', filterTags)
				.innerJoin("dishes", "dishes.id", "tags.dish_id")
				.groupBy('dishes.id')
				.orderBy('dishes.title');

		} else {

			dishes = await knex('dishes')
				.where({ user_id })
				.whereLike('title', `%${title}%`)
				.orderBy('title');
		};

		const userTags = await knex('tags').where({ user_id });

		const dishesWithTags = dishes.map(dish => {

			const dishTags = userTags.filter(tag => tag.dish_id === dish.id);

			return {
				...dish,
				tags: dishTags
			};
		});

		return response.json(dishesWithTags);
	};


	async showDish(request, response) {

		const { id } = request.params;

		const dish = await knex('dishes').where({ id }).first();

		const tags = await knex('tags').where({ dish_id: id }).orderBy('name');

		return response.json({
			...dish,
			tags
		});
	};


	async delete(request, response) {

		const { id } = request.params;

		await knex('dishes').where({ id }).delete();

		return response.json();
	};


	async update(request, response) {

		const user_id = request.user.id;
		const { id } = request.params;		// esse "id" é o "dish_id"

		const { title, category, price, description } = request.body;
		const { tags } = request.body;


		const database = await sqliteConnection();

		await database.run(`
			UPDATE dishes SET
			title = ?,
			category = ?,
			price = ?,
			description = ?
      WHERE id = ?`,
			[title, category, price, description, id]
		);


		await knex('tags').where({ dish_id: id }).delete();

		if (tags && tags.length > 0) {

			const tagsInsert = tags.map(name => {
				return {
					dish_id: id,
					name,
					user_id
				};
			});

			await knex('tags').insert(tagsInsert);
		};

		return response.status(200).json();
	};
};

module.exports = DishesController;
