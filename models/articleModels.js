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
      console.log(article);
    });
};
