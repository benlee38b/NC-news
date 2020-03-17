const apiRouter = require('express').Router();

const { topicRouter } = require('./topicRouter');
const { userRouter } = require('./userRouter');
const { articleRouter } = require('./articleRouter');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/articles', articleRouter);

module.exports = { apiRouter };
