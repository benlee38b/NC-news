const commentRouter = require('express').Router();
const {
  patchCommentById,
  removeCommentById
} = require('../controllers/commentControllers');
const { send405Error } = require('../errorHandling.js');

commentRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(removeCommentById)
  .all(send405Error);

module.exports = { commentRouter };
