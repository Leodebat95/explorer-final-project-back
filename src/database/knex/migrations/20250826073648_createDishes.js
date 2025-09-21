
exports.up = knex => knex.schema.createTable("dishes", table => {

	table.increments('id')
  table.text('title')
  table.text('category')
  table.text('description')

  table.text('picture').nullable()

  table.decimal('price', 5, 2).notNullable().defaultTo(0.00)

  table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable("dishes");
