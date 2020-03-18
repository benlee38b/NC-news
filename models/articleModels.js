const connection = require('../connection');

exports.selectArticleById = (article_id, query) => {
  return connection('articles')
    .select('*')
    .modify(queryBuilder => {
      if (query.username) {
        queryBuilder.where('articles.author', '=', `${query.username}`);
      }
      if (query.topic) {
        queryBuilder.where('articles.topic', '=', `${query.topic}`);
      }
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Query Value Not Found'
        });
      }
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
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .count('comments.article_id AS comment_count')
        .modify(queryBuilder => {
          if (query.sort_by) {
            queryBuilder.orderBy(query.sort_by, query.order || 'DESC');
          }
        })
        .modify(queryBuilder => {
          if (article_id) {
            queryBuilder.having('articles.article_id', '=', `${article_id}`);
          }
        })
        .modify(queryBuilder => {
          if (query.username) {
            queryBuilder.where('articles.author', '=', `${query.username}`);
          }
        })
        .modify(queryBuilder => {
          if (query.topic) {
            queryBuilder.where('articles.topic', '=', `${query.topic}`);
          }
        })
        .then(articles => {
          console.log(articles);
          if (articles.length === 0) {
            return Promise.reject({
              status: 404,
              message: 'Article_id Not Found'
            });
          }
          if (articles.length === 1) return articles[0];
          else return articles;
        });
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

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  if (order !== 'asc' || order !== 'desc') {
    return Promise.reject({
      status: 400,
      message: 'Invalid query value'
    });
  }
  return connection('comments')
    .select('*')
    .modify(queryBuilder => {
      if (sort_by) {
        queryBuilder.orderBy(sort_by, order || 'desc');
      }
    })
    .where({ article_id })
    .then(comments => {
      console.log(comments);
      return comments;
    });
};
