const articleRouter = require('express').Router();
const { getArticleById } = require('../controllers/articleControllers');

articleRouter.route('/:article_id').get(getArticleById);

module.exports = { articleRouter };
