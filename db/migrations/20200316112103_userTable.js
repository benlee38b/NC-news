const ENV = process.env.NODE_ENV || 'development';
exports.up = function(knex) {
  if (ENV === 'development') console.log('creating user table');
  return knex.schema.createTable('users', userTable => {
    userTable.string('username', [50]).primary();
    userTable.string('avatar_url').notNullable();
    userTable.string('name').notNullable();
  });
};

exports.down = function(knex) {
  if (ENV === 'development') console.log('removing user table');
  return knex.schema.dropTable('users');
};
