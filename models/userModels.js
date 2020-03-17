const connection = require('../connection');

exports.selectUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .then(user => {
      console.log(user);
      if (user.length === 0) {
        return Promise.reject({
          message: 'Username Not Found',
          status: 404
        });
      }
      return user[0];
    });
};
