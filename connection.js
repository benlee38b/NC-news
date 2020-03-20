const ENV = process.env.NODE_ENV || 'development';

const dbConfig =
  ENV === 'production'
    ? { client: 'pg', connection: process.env.DATABASE_URL }
    : require('./knexfile');
const knex = require('knex');
const connection = knex(dbConfig);
const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = connection;
