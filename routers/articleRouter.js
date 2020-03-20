const articleRouter = require('express').Router();
const {
  getArticles,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require('../controllers/articleControllers');
const { send405Error } = require('../errorHandling.js');

articleRouter
  .route('/')
  .get(getArticles)
  .all(send405Error);

articleRouter
  .route('/:article_id')
  .get(getArticles)
  .patch(patchArticleById)
  .all(send405Error);

articleRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = { articleRouter };
