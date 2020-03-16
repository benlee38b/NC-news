process.env.NODE_ENV = test;

beforeEach(() => {
  knex.seed.run();
});
