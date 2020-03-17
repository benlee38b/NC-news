const { selectArticleById } = require('../models/articleModels');

exports.getArticleById = (req, res, next) => {
  console.log(req.params.article_id);
  selectArticleById(req.params.article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(err => {
      // console.log(err);
      if (err.code === '22P02') err.message = 'Article_id Not Valid';
      next(err);
    });
};
