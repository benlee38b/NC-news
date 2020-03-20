const connection = require('../connection');

exports.selectUserByUsername = username => {
  const regex = /\W+/g;

  if (regex.test(username)) {
    return Promise.reject({
      status: 400,
      message: 'Username Not valid'
    });
  }
  return connection('users')
    .select('*')
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          message: 'Username Does Not Exist',
          status: 404
        });
      }
      return user[0];
    });
};
