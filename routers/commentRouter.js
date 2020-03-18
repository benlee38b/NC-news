const commentRouter = require('express').Router();
const {
  patchCommentById,
  removeCommentById
} = require('../controllers/commentControllers');

commentRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(removeCommentById);

module.exports = { commentRouter };
