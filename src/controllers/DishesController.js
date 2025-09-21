// controllers (3º/5)

const knex = require("../database/knex");

const sqliteConnection = require('../database/sqlite');



class DishesController {

	async create(request, response) {

		const { title, category, description, price, tags } = request.body;
		const user_id = request.user.id;

		const [dish_id] = await knex('dishes').insert({
			title,
			category,
			description,
			price,
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


		const dish = await knex('dishes').where({ id: dish_id }).first();

		return response.json(dish);
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
					// "dishes.user_id" --- pode manter opcionalmente
				])
				/* .where('dishes.user_id', user_id)
						  significa: onde o "user_id do prato" seja igual ao "user_id do user logado"
							utilidade: faz cada user ver apenas seus próprios dishes */
				.whereLike('dishes.title', `%${title}%`)
				.whereIn('name', filterTags)
				.innerJoin("dishes", "dishes.id", "tags.dish_id")
				.groupBy('dishes.id')
				.orderBy('dishes.title');

		} else {

			dishes = await knex('dishes')
				// .where({ user_id }) --- forma abreviada do filtro "where" acima
				.whereLike('title', `%${title}%`)
				.orderBy('title');
		};

		const allTags = await knex('tags');
			// .where({ user_id });

		const userLikes = await knex('likes').where({ user_id });
			// Busca os likes do usuário logado
		
		const dishesWithTags = dishes.map(dish => {

			const dishTags = allTags.filter(tag => tag.dish_id === dish.id);

			const userLike = userLikes.find(like => like.dish_id === dish.id);
				// Verifica like do user > para este dish

			return {
				...dish,
				tags: dishTags,
				like: userLike ? userLike.like : 0
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
			description = ?,
      updated_at = DATETIME('now')
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


	async updateLike(request, response) {

		const user_id = request.user.id;
		const { id: dish_id } = request.params;
		const { like } = request.body;

		const database = await sqliteConnection();


		// Verifica se já existe um like > deste user > pra este dish
		const existingLike = await database.get(

			`SELECT * FROM likes WHERE user_id = ? AND dish_id = ?`,
			[user_id, dish_id]
		);

		// Atualiza o like existente
		if(existingLike) {
			await database.run(

				`UPDATE likes SET like = ? WHERE user_id = ? AND dish_id = ?`,
				[like ? 1 : 0, user_id, dish_id]
			);

		// Insere novo like
		} else {
			await database.run(
				
				`INSERT INTO likes (user_id, dish_id, like) VALUES (?, ?, ?)`,
				[user_id, dish_id, like ? 1 : 0]
			);
		};

		return response.status(200).json();
	};
};

module.exports = DishesController;
