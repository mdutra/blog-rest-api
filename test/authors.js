process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const app = require('../api/app');
const Author = require('../api/models/authorModel');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(chaiHttp);

faker.locale = 'pt_BR';

describe('Authors', function () {
  // Delete and populate database before tests
  before(function () {
    return Author.deleteMany({})
      .then(() => {
        const authors = [...new Array(10)]
          .map(() => ({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          }));

        return Author.create(authors);
      });
  });

  afterEach(function () {
    // Delete every model to prevent error in mocha watch mode
    mongoose.deleteModel(/.+/);
  });

  describe('GET requests', function () {
    it('should get list of authors', function () {
      return chai.request(app)
        .get('/authors')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.forEach((author) => {
            author.should.be.a('object');
            author.should.have.property('firstName');
            author.should.have.property('lastName');
          });
        });
    });

    it('should get author by ID', function () {
      return Author.findOne()
        .then(({ _id }) => chai.request(app)
          .get(`/authors/${_id}`))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
        });
    });

    it('should not find author by ID after deleting it', function () {
      return Author.findOneAndDelete()
        .then(({ _id }) => chai.request(app)
          .get(`/authors/${_id}`))
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('NotFoundError');
        });
    });

    it('should not get author with invalid ID', function () {
      return chai.request(app)
        .get(`/authors/id_${faker.random.number()}`)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('kind').eql('ObjectId');
        });
    });
  });

  describe('POST requests', function () {
    it('should store author', function () {
      const author = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      return chai.request(app)
        .post('/authors')
        .send(author)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
        });
    });

    it('should not store author without firstName and lastName', function () {
      const author = {};

      return chai.request(app)
        .post('/authors')
        .send(author)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('firstName');
          res.body.errors.firstName.should.have.property('kind').eql('required');
          res.body.errors.should.have.property('lastName');
          res.body.errors.lastName.should.have.property('kind').eql('required');
        });
    });
  });

  describe('PUT requests', function () {
    it('should update author\'s firstName', function () {
      const newFirstName = faker.name.firstName();

      return Author.findOne()
        .then(({ _id }) => chai.request(app)
          .put(`/authors/${_id}`)
          .send({ firstName: newFirstName }))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName').eql(newFirstName);
        });
    });
  });

  describe('DELETE requests', function () {
    it('should delete author by ID', function () {
      return Author.findOne()
        .then(({ _id }) => chai.request(app)
          .delete(`/authors/${_id}`))
        .then((res) => {
          res.should.have.status(204);
          res.body.should.be.eql({});
        });
    });
  });
});
