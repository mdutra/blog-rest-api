const config = require('config');
const faker = require('faker');
const mongoose = require('mongoose');

const Author = require('./api/models/authorModel');
const Comment = require('./api/models/commentModel');
const Post = require('./api/models/postModel');
const User = require('./api/models/userModel');

const mongoUrl = config.get('mongoUrl');

/* eslint-disable no-console */

faker.locale = 'pt_BR';

function randomId(arr) {
  return arr[Math.floor(Math.random() * arr.length)].id;
}

mongoose.connect(mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
})
  .then(() => Promise.all([
    Author.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    User.deleteMany({}),
  ]))
  .then(() => {
    const users = [...new Array(50)]
      .map(() => new User({
        name: faker.name.findName(),
        email: faker.internet.exampleEmail(),
      }));

    const authors = [...new Array(10)]
      .map(() => new Author({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }));

    const comments = [...new Array(100)]
      .map(() => new Comment({
        content: faker.lorem.words(),
        user: randomId(users),
      }));

    const posts = [...new Array(10)]
      .map(() => new Post({
        title: faker.lorem.words(),
        subtitle: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        authors: [randomId(authors)],
        comments: [...new Array(10)]
          .map(() => randomId(comments)),
      }));

    posts.push(new Post({
      title: 'Um título qualquer',
      content: faker.lorem.paragraphs(),
      authors: [randomId(authors)],
      comments: [...new Array(10)]
        .map(() => randomId(comments)),
    }));

    return Promise.all([
      ...(users.map(user => user.save())),
      ...(authors.map(author => author.save())),
      ...(comments.map(comment => comment.save())),
      ...(posts.map(post => post.save())),
    ]);
  })
  .then(() => {
    console.log(`Data stored in ${mongoUrl}`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
