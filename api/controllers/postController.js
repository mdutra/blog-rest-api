const Post = require('../models/postModel');

const postController = {
  findAllPosts(req, res, next) {
    Post.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  findPostById(req, res, next) {
    Post.findById(req.params.id)
      .then((post) => {
        if (!post) {
          const err = new Error('Author not found for the given ObjectId');
          err.name = 'NotFoundError';
          throw err;
        }

        res.json(post);
      })
      .catch(next);
  },
  createPost(req, res, next) {
    Post.create(req.body)
      .then(res.json.bind(res))
      .catch(next);
  },
};

module.exports = postController;
