const connection = require('../../connection');

exports.formatDates = list => {
  let formattedData = [];
  list.forEach(item => {
    const dateObject = new Date(item.created_at);
    let newObj = { ...item };
    newObj.created_at = dateObject;
    formattedData.push(newObj);
  });
  return formattedData;
};

exports.makeRefObj = (list, key, value) => {
  let refObj = {};
  list.forEach(item => {
    refObj[item[key]] = item[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  let formattedData = [];
  comments.forEach(comment => {
    const dateObject = new Date(comment.created_at);
    let newObj = { ...comment };
    newObj.created_at = dateObject;
    newObj.author = comment.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    formattedData.push(newObj);
  });
  return formattedData;
};

exports.checkIfArticleIdExists = article_id => {
  return connection('articles')
    .select('*')
    .where({ article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'Article_Id Does Not Exist'
        });
      } else return [];
    });
};
