const connection = require('../connection');
const { selectTopics } = require('./topicModels');
const { selectUserByUsername } = require('./userModels');
const { checkIfArticleIdExists } = require('../db/utils/utils');

exports.selectArticleById = (article_id, query) => {
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
    .orderBy(query.sort_by || 'created_at', query.order || 'DESC')
    .modify(queryBuilder => {
      if (article_id) {
        queryBuilder.having('articles.article_id', '=', `${article_id}`);
      }
    })
    .modify(queryBuilder => {
      if (query.author) {
        queryBuilder.where('articles.author', '=', `${query.author}`);
      }
    })
    .modify(queryBuilder => {
      if (query.topic) {
        queryBuilder.where('articles.topic', '=', `${query.topic}`);
      }
    })
    .then(articles => {
      if (articles.length === 0 && article_id) {
        return Promise.reject({
          status: 404,
          message: 'Article_id Not Found'
        });
      }

      if (query.topic && articles.length === 0) {
        return selectTopics(query.topic);
      }

      if (query.author && articles.length === 0) {
        return selectUserByUsername(query.author);
      }

      if (articles.length === 1) return articles[0];
      else return articles;
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
    .increment('votes', inc_votes || 0)
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
  const regex = /(asc)|(desc)/g;

  if (regex.test(order) === false && order) {
    return Promise.reject({
      status: 400,
      message: 'Invalid query value'
    });
  }
  return connection('comments')
    .select('*')
    .orderBy(sort_by || 'created_at', order || 'DESC')
    .where({ article_id })
    .then(comments => {
      if (comments.length === 0) return checkIfArticleIdExists(article_id);
      return comments;
    });
};
