process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const app = require('../api/app');
const Author = require('../api/models/authorModel');
const Post = require('../api/models/postModel');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(chaiHttp);

faker.locale = 'pt_BR';

describe('Posts', function () {
  // Empty collections before each test
  beforeEach(function () {
    return Promise.all([
      Author.deleteMany({}),
      Post.deleteMany({}),
    ]);
  });

  afterEach(function () {
    // Delete every model to prevent error in mocha watch mode
    mongoose.deleteModel(/.+/);
  });

  describe('GET requests', function () {
    it('should get empty list of posts', function () {
      return chai.request(app)
        .get('/posts')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
        });
    });
  });

  describe('POST requests', function () {
    it('should store blog post', function () {
      const author = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      return Author.create(author)
        .then(({ _id }) => {
          const post = {
            title: faker.lorem.words(),
            subtitle: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            authors: [_id],
          };

          return chai.request(app)
            .post('/posts')
            .send(post);
        })
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('subtitle');
          res.body.should.have.property('content');
          res.body.should.have.property('published');
          res.body.should.have.property('authors');
          res.body.authors.length.should.be.above(0);
        });
    });

    it('should not store blog post without required fields', function () {
      const post = {
        subtitle: faker.lorem.words(),
      };

      chai.request(app)
        .post('/posts')
        .send(post)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          res.body.errors.should.have.property('content');
          res.body.errors.content.should.have.property('kind').eql('required');
          res.body.errors.should.have.property('authors');
          res.body.errors.authors.should.have.property('message')
            .eql('At least one author is required');
        });
    });
  });
});
