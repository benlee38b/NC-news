const { selectTopics } = require('../models/topicModels');

exports.getTopics = (req, res, next) => {
  selectTopics(req.body.params).then(topics => {
    res.send({ topics });
  });
};
