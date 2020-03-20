const { selectUserByUsername } = require('../models/userModels');

exports.getUserByUsername = (req, res, next) => {
  selectUserByUsername(req.params.username)
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      next(err);
    });
};
