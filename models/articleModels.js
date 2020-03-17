const connection = require('../connection');

exports.selectArticleById = article_id => {
  return connection('articles')
    .select(
      'articles.article_id',
      'title',
      'topic',
      'articles.author',
      'articles.body',
      'articles.created_at',
      'articles.votes'
    )
    .join('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.article_id AS comment_count')
    .having('articles.article_id', '=', `${article_id}`)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Article_id Not Found'
        });
      }
      return article[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      message: 'Invalid Input: Missing Required Fields',
      status: 400
    });
  }
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      message: 'Invalid increment value on request',
      status: 400
    });
  }
  return connection('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Article_Id Not Found'
        });
      }
      return article[0];
    });
};

exports.insertCommentByArticleId = (author, body, article_id) => {
  return connection('comments')
    .insert({ author, body, article_id })
    .returning('*')
    .then(comment => {
      console.log(comment);
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Article_Id Not Found'
        });
      }
      return comment[0];
    });
};
