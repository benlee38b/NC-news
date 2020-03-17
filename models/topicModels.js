const connection = require('../connection');

exports.selectTopics = () => {
  return connection('topics')
    .select('*')
    .then(topics => {
      return topics;
    });
};
