const ENV = process.env.NODE_ENV || 'development';

exports.up = function(knex) {
  if (ENV === 'development') console.log('creating topics table');
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
  });
};

exports.down = function(knex) {
  if (ENV === 'development') console.log('removing topics table');
  return knex.schema.dropTable('topics');
};
