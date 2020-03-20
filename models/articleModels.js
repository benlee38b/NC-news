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
    .paginate({ perPage: query.limit || 10, currentPage: query.p || 1 })
    .then(articles => {
      if (articles.data.length === 0 && article_id) {
        return Promise.reject({
          status: 404,
          message: 'Article_id Not Found'
        });
      }

      if (query.topic && articles.data.length === 0) {
        return selectTopics(query.topic);
      }

      if (query.author && articles.data.length === 0) {
        return selectUserByUsername(query.author);
      }
      articles.data.forEach(article => {
        article.total_count = articles.pagination.total;
      });
      if (articles.data.length === 1) return articles.data[0];
      else return articles.data;
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

exports.selectCommentsByArticleId = (article_id, query) => {
  const regex = /(asc)|(desc)/g;

  if (regex.test(query.order) === false && query.order) {
    return Promise.reject({
      status: 400,
      message: 'Invalid query value'
    });
  }
  return connection('comments')
    .select('*')
    .orderBy(query.sort_by || 'created_at', query.order || 'DESC')
    .where({ article_id })
    .paginate({ perPage: query.limit || 10, currentPage: query.p || 1 })
    .then(comments => {
      comments.data.forEach(comment => {
        comment.total_count = comments.pagination.total;
      });
      if (comments.data.length === 0) return checkIfArticleIdExists(article_id);
      return comments.data;
    });
};
