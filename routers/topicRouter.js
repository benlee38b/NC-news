const topicRouter = require('express').Router();

const { getTopics } = require('../controllers/topicControllers');
const { send405Error } = require('../errorHandling.js');

topicRouter
  .route('/')
  .get(getTopics)
  .all(send405Error);

module.exports = { topicRouter };
