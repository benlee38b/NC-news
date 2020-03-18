const {
  updateCommentById,
  deleteCommentById
} = require('../models/commentModels');

exports.patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err);
      if (err.code === '22P02') {
        err.message = 'Comment_id is not valid';
      }
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req.params.comment_id).then(blank => {
    res.sendStatus(204);
  });
};
