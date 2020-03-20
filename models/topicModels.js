const connection = require('../connection');

exports.selectTopics = slug => {
  return connection('topics')
    .select('*')
    .modify(queryBuilder => {
      if (slug) queryBuilder.where({ slug });
    })
    .then(topics => {
      if (topics.length === 0) {
        return Promise.reject({
          message: 'Topic Does Not Exist',
          status: 404
        });
      }
      return topics;
    });
};
