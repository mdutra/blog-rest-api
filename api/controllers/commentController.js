const Comment = require('../models/commentModel');

const commentController = {
  findAllPostComments(req, res, next) {
    Comment.find()
      .then(res.json.bind(res))
      .catch(next);
  },
};

module.exports = commentController;
