const ENV = process.env.NODE_ENV || 'development';
exports.up = function(knex) {
  if (ENV === 'development') console.log('creating articles table');
  return knex.schema.createTable('articles', articleTable => {
    articleTable.increments('article_id').primary();
    articleTable.string('title').notNullable();
    articleTable.text('body').notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug');
    articleTable.string('author').references('users.username');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  if (ENV === 'development') console.log('removing articles table');
  return knex.schema.dropTable('articles');
};
