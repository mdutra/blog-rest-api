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
  // Empty collection before each test
  beforeEach(function () {
    return Author.remove({});
  });

  afterEach(function () {
    // Delete every model to prevent error in mocha watch mode
    mongoose.deleteModel(/.+/);
  });

  describe('GET requests', function () {
    it('should get empty list of authors', function () {
      return chai.request(app)
        .get('/authors')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
        });
    });

    it('should not get author by ID', function () {
      return chai.request(app)
        .get('/authors/5d43316b9d58c840821af979')
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('NotFoundError');
        });
    });

    it('should get author by ID', function () {
      const author = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      return Author.create(author)
        .then(({ _id }) => chai.request(app).get(`/authors/${_id}`))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
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
      const author = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const newFirstName = faker.name.firstName();

      return Author.create(author)
        .then(({ _id }) => chai.request(app)
          .put(`/authors/${_id}`)
          .send({ firstName: newFirstName }))
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstName').eql(newFirstName);
          res.body.should.have.property('lastName').eql(author.lastName);
        });
    });
  });
});
