const dbConfig =
  ENV === 'production'
    ? { client: 'pg', connection: process.env.DATABASE_URL }
    : require('./knexfile');
const knex = require('knex');
const connection = knex(dbConfig);

module.exports = connection;
