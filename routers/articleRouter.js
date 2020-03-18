const articleRouter = require('express').Router();
const {
  getArticles,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require('../controllers/articleControllers');

articleRouter.route('/').get(getArticles);
articleRouter
  .route('/:article_id')
  .get(getArticles)
  .patch(patchArticleById);

articleRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId);

module.exports = { articleRouter };
