const { selectTopics } = require('../models/topicModels');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.send({ topics });
  });
};
