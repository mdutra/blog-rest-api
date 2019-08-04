const config = require('config');
const faker = require('faker');
const mongoose = require('mongoose');

const Author = require('./api/models/authorModel.js');
const Post = require('./api/models/postModel.js');

const mongoUrl = config.get('mongoUrl');

/* eslint-disable no-console */

faker.locale = 'pt_BR';

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => Promise.all([
    Author.deleteMany({}),
    Post.deleteMany({}),
  ]))
  .then(() => {
    const authors = [...new Array(10)]
      .map(() => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }));

    return Author.create(authors);
  }).then((authors) => {
    const posts = authors.map(({ _id }) => ({
      title: faker.lorem.words(),
      subtitle: faker.lorem.words(),
      content: faker.lorem.paragraphs(),
      authors: [_id],
    }));

    return Post.create(posts);
  })
  .then(() => {
    console.log(`Data stored in ${mongoUrl}`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
