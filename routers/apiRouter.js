const apiRouter = require('express').Router();

const { topicRouter } = require('./topicRouter');
const { userRouter } = require('./userRouter');
const { articleRouter } = require('./articleRouter');
const { commentRouter } = require('./commentRouter');
const { send405Error } = require('../errorHandling.js');
const { getEndpoints } = require('../controllers/apiController');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter
  .route('/')
  .get(getEndpoints)
  .all(send405Error);

module.exports = { apiRouter };
