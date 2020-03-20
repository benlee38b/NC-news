const endpoints = require('../endpoints/availableEndpoints');

exports.getEndpoints = (req, res, next) => {
  res.send({ endpoints });
};
