
exports.up = knex => knex.schema.createTable("likes", table => {

	table.increments('id')

  table.integer('dish_id').notNullable().references('id').inTable('dishes').onDelete('CASCADE')
  table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

  table.integer('like').defaultTo(0).notNullable()

  table.timestamp('created_at').default(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable("likes");
