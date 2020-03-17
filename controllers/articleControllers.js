const {
  selectArticleById,
  updateArticleById,
  insertCommentByArticleId
} = require('../models/articleModels');

exports.getArticleById = (req, res, next) => {
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

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc_votes = req.body.inc_votes;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => {
      // console.log(err);
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
