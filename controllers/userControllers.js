const { selectUserByUsername } = require('../models/userModels');

exports.getUserByUsername = (req, res, next) => {
  console.log(req.params.username);
  selectUserByUsername(req.params.username)
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
