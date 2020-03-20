const {
  selectArticleById,
  updateArticleById,
  insertCommentByArticleId,
  selectCommentsByArticleId
} = require('../models/articleModels');

exports.getArticles = (req, res, next) => {
  selectArticleById(req.params.article_id, req.query)
    .then(articles => {
      if (Array.isArray(articles) === true) {
        res.send({ articles });
      } else res.send({ article: articles });
    })
    .catch(err => {
      if (err.code === '22P02') err.message = 'Article_id Not Valid';
      if (err.code === '42703') err.message = 'Invalid query input';
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc_votes = req.body.inc_votes;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err.code === '22P02') err.message = 'Invalid Article Id';
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { body } = req.body;
  const author = req.body.username;
  const article_id = req.params.article_id;
  insertCommentByArticleId(author, body, article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      if (err.code === '23502') {
        err.message = 'Missing Required Fields';
      }

      if (err.code === '23503') {
        err.message = 'Article_Id Does Not Exist';
      }
      if (err.code === '22P02') err.message = 'Invalid Article Id';
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  sort_by = req.query.sort_by;
  order = req.query.order;
  selectCommentsByArticleId(req.params.article_id, sort_by, order)
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => {
      if (err.code === '42703') err.message = 'Invalid query value';
      next(err);
    });
};
