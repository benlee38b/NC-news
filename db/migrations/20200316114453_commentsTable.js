const ENV = process.env.NODE_ENV || 'development';
exports.up = function(knex) {
  if (ENV === 'development') console.log('creating comments table');
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function(knex) {
  if (ENV === 'development') console.log('removing comments table');
  return knex.schema.dropTable('comments');
};
