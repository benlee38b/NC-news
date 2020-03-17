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
  describe('/user', () => {
    describe('/:username', () => {
      it('GET:200 - responds with a user object based on the username provided in the params', () => {
        return request(app)
          .get('/api/user/butter_bridge')
          .expect(200)
          .then(res => {
            expect(res.body.user).to.eql({
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            });
          });
      });
      it('GET:404 - responds with an appropriate error message when the provided username does not exist', () => {
        return request(app)
          .get('/api/user/cheeze_wizz')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.eql('Username Not Found');
          });
      });
      // it.only('GET:400 - responds with an appropriate error message when the provided username is not valid', () => {
      //   return request(app)
      //     .get('/api/user/:::::')
      //     .expect(400)
      //     .then(res => {
      //       expect(res.body.message).to.eql('Username Not valid');
      //     });
      // });
      it('status:405 when invalid methods applied to path', () => {
        const invalidMethods = ['patch', 'put', 'post', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/user/butter_bridge')
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe('/articles', () => {
    describe('/:article_id', () => {
      // it.only('GET:200 - responds with an article object of the article matching the article_id passed into the params', () => {
      //   return request(app)
      //     .get('/api/articles/1')
      //     .expect(200)
      //     .then(res => {
      //       expect(res.body.article).to.equal({
      //         article_id: 1,
      //         title: 'Living in the shadow of a great man',
      //         topic: 'mitch',
      //         author: 'butter_bridge',
      //         body: 'I find this existence challenging',
      //         created_at: new Date(1542284514171),
      //         votes: 100,
      //         comment_count: '13'
      //       });
      //     });
      // });
      it('GET:404 - responds with an appropriate error message when the article_id cannot be found', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.eql('Article_id Not Found');
          });
      });
      it('GET:400 - responds with an appropriate error message when the article_id is not valid', () => {
        return request(app)
          .get('/api/articles/not-a-number')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql('Article_id Not Valid');
          });
      });
    });
  });
});
