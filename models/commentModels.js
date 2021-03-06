const connection = require('../connection');

exports.updateCommentById = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: 'Missing Required Fields',
    });
  }
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      message: 'Increment Value Invalid',
      status: 400,
    });
  }
  return connection('comments')
    .increment('votes', inc_votes || 0)
    .where('comment_id', '=', `${comment_id}`)
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Comment_id Not Found',
        });
      }
      return comment[0];
    });
};

exports.selectCommentByCommentId = (comment_id) => {
  return connection('comments')
    .select('*')
    .where({ comment_id })
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Comment_id Not Found',
        });
      }
    });
};

exports.deleteCommentById = (comment_id) => {
  return connection('comments')
    .where({ comment_id })
    .del()
    .then(() => {
      return;
    });
};
