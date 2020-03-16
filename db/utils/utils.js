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
  const formattedComments = this.formatDates(comments);
  formattedComments.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
  });
  return formattedComments;
};
