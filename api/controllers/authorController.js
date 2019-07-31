const Author = require('../models/authorModel');

const authorController = {
  findAllAuthors(req, res, next) {
    Author.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  createAuthor(req, res, next) {
    Author.create(req.body)
      .then(res.json.bind(res))
      .catch(next);
  },
};

module.exports = authorController;
