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
  // Delete and populate database before tests
  before(function () {
    return Promise.all([
      Author.deleteMany({}),
      Post.deleteMany({}),
    ]).then(() => {
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
    });
  });

  afterEach(function () {
    // Delete every model to prevent error in mocha watch mode
    mongoose.deleteModel(/.+/);
  });

  after(function () {
    Author.collection.drop();
    Post.collection.drop();
  });

  describe('GET requests', function () {
    it('should get list of posts', function () {
      return chai.request(app)
        .get('/posts')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.forEach((post) => {
            post.should.be.a('object');
            post.should.have.property('title');
            post.should.have.property('subtitle');
            post.should.have.property('content');
            post.should.have.property('permalink');
            post.should.have.property('authors');
            post.authors.should.be.a('array');
            post.authors.length.should.be.above(0);
          });
        });
    });

    it('should get blog post by ID', function () {
      return Post.findOne()
        .then(({ _id }) => chai.request(app)
          .get(`/posts/${_id}`))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('published');
          res.body.should.have.property('permalink');
          res.body.should.have.property('authors');
          res.body.authors.length.should.be.above(0);
        });
    });

    it('should get limited list of blog posts', function () {
      return chai.request(app)
        .get('/posts?limit=5')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(5);
          res.body.forEach((post) => {
            post.should.be.a('object');
            post.should.have.property('title');
            post.should.have.property('content');
            post.should.have.property('published');
            post.should.have.property('permalink');
            post.should.have.property('authors');
          });
        });
    });

    it('should get list of authors from a specific range', function () {
      const offset = 3;
      const limit = 4;

      return Promise.all([
        Post.find(),
        chai.request(app)
          .get(`/posts?offset=${offset}&limit=${limit}`),
      ])
        .then(([posts, res]) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(limit);
          res.body.forEach((post, i) => {
            post.should.be.a('object');
            post.should.have.property('_id').eql(posts[offset + i].id);
            post.should.have.property('title');
            post.should.have.property('content');
            post.should.have.property('published');
            post.should.have.property('permalink');
            post.should.have.property('authors');
          });
        });
    });

    it('should get blog post by permalink', function () {
      return Post.findOne()
        .then(({ permalink }) => chai.request(app)
          .get(`/posts/permalink/${permalink}`))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('published');
          res.body.should.have.property('permalink');
          res.body.should.have.property('authors');
          res.body.authors.length.should.be.above(0);
        });
    });

    it('should not find blog post by ID after deleting it', function () {
      return Post.findOneAndDelete()
        .then(({ _id }) => chai.request(app)
          .get(`/posts/${_id}`))
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('NotFoundError');
        });
    });

    it('should not get blog post with invalid ID', function () {
      const invalidId = `id_${faker.random.number()}`;

      return chai.request(app)
        .get(`/posts/${invalidId}`)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.be.a('array');
          res.body[0].should.have.property('error');
          res.body[0].should.have.property('name');
          res.body[0].should.have.property('path');
          res.body[0].should.have.property('value').eql(invalidId);
        });
    });
  });

  describe('POST requests', function () {
    it('should store blog post', function () {
      return Author.findOne()
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
          res.body.should.have.property('permalink');
          res.body.should.have.property('authors');
          res.body.authors.length.should.be.above(0);
        });
    });

    it('should not store blog post without required fields', function () {
      const post = {
        subtitle: faker.lorem.words(),
      };

      return chai.request(app)
        .post('/posts')
        .send(post)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          res.body.forEach((error) => {
            error.should.have.property('error');
            error.should.have.property('name').eql('ValidationError');
            error.should.have.property('path');
          });
        });
    });

    it('should not store blog post with the same title', function () {
      return Author.findOne()
        .then(({ _id }) => {
          const post = {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            authors: [_id],
          };

          const requester = chai.request(app).keepOpen();

          return requester.post('/posts').send(post)
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('title');
              res.body.should.have.property('content');
              res.body.should.have.property('authors');

              return requester.post('/posts').send(post);
            })
            .then((res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('name').eql('MongoError');
            })
            .then(() => requester.close());
        });
    });
  });

  describe('PUT requests', function () {
    it('should update blog post\'s title', function () {
      const newTitle = faker.lorem.words();

      return Post.findOne()
        .then(({ _id }) => chai.request(app)
          .put(`/posts/${_id}`)
          .send({ title: newTitle }))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql(newTitle);
          res.body.should.have.property('updated');
        });
    });
  });

  describe('DELETE requests', function () {
    it('should delete blog post by ID', function () {
      return Post.findOne()
        .then(({ _id }) => chai.request(app)
          .delete(`/posts/${_id}`))
        .then((res) => {
          res.should.have.status(204);
          res.body.should.be.eql({});
        });
    });
  });
});
