process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../api/app');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(chaiHttp);

faker.locale = 'pt_BR';

describe('Posts', function () {
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
});
