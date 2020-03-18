const connection = require('../connection');

exports.updateCommentById = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: 'Missing Required Fields'
    });
  }
  const regex = /\D+/g;
  if (regex.test(inc_votes)) {
    return Promise.reject({
      status: 400,
      message: 'Increment Value Invalid'
    });
  }
  return connection('comments')
    .increment('votes', inc_votes)
    .where('comment_id', '=', `${comment_id}`)
    .returning('*')
    .then(comment => {
      console.log(comment);
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Comment_id Not Found'
        });
      }
      return comment[0];
    });
};

exports.deleteCommentById = comment_id => {
  return connection('comments')
    .where({ comment_id })
    .del()
    .then(() => {
      return {};
    });
};
