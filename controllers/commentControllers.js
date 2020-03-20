const {
  updateCommentById,
  deleteCommentById,
  selectCommentByCommentId
} = require('../models/commentModels');

exports.patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.code === '22P02') {
        err.message = 'Comment_id is not valid';
      }
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  return Promise.all([
    selectCommentByCommentId(req.params.comment_id),
    deleteCommentById(req.params.comment_id)
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
