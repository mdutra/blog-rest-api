const Post = require('../models/postModel');

const postController = {
  findAllPosts(req, res, next) {
    Post.find()
      .then(res.json.bind(res))
      .catch(next);
  },
};

module.exports = postController;
