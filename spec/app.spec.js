process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../connection');
const chaiSorted = require('chai-sorted');
const chai = require('chai');

beforeEach(() => {
  return connection.seed.run();
});
after(() => {
  return connection.destroy();
});

describe('/api', () => {
  describe('/topics', () => {
    it('GET: 200 - responds with an array of all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.contain.keys('slug', 'description');
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
        });
    });

    it('status:405 when invalid methods applied to path', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/topics')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });

    it('status:404 when path name is invalid', () => {
      return request(app)
        .get('/api/adghdkgfhsdhg')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('404: File Not Found');
        });
    });
  });
});
