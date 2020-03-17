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
      it('GET:400 - responds with an appropriate error message when the provided username is not valid', () => {
        return request(app)
          .get('/api/user/:::::')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql('Username Not valid');
          });
      });
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
      it('GET:200 - responds with an article object of the article matching the article_id passed into the params', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(res => {
            expect(res.body.article.article_id).to.equal(1);
          });
      });
      it('GET:200 - returned article object has a key of comment_count totaling the comments attached to the passed article_id', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(res => {
            expect(res.body.article.comment_count).to.equal('13');
          });
      });
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
      it('PATCH:201 - responds with an article object with the votes key incremented by a value stated in the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 50 })
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.eql(150);
          });
      });
      it('GET:400 - responds with an appropriate error message when inc_votes not included on the body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql(
              'Invalid Input: Missing Required Fields'
            );
          });
      });
      it('GET:400 - responds with an appropriate error message when inc_votes not a valid format', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'not-a-number' })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql(
              'Invalid increment value on request'
            );
          });
      });
      it('GET:400 - responds with an appropriate error message article_id is not valid', () => {
        return request(app)
          .patch('/api/articles/not-a-number')
          .send({ inc_votes: 50 })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql('Invalid Article Id');
          });
      });
      it('GET:404 - responds with an appropriate error message when article Id is not found', () => {
        return request(app)
          .patch('/api/articles/999')
          .send({ inc_votes: 50 })
          .expect(404)
          .then(res => {
            expect(res.body.message).to.eql('Article_Id Not Found');
          });
      });
      describe('/comments', () => {
        it('POST:201 - responds with an object of the comment', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed'
            })
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.contain.keys(
                'author',
                'body',
                'comment_id',
                'article_id',
                'votes',
                'created_at'
              );
              expect(res.body.comment.author).to.eql('butter_bridge');
            });
        });
        it('POST:400 - responds an appropriate error message when body is missing one or more required fields', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              body:
                'what an awful article you have written you should be ashamed'
            })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.eql('Missing Required Fields');
            });
        });
        it('POST:400 - responds with an appropriate error message article_id is not valid', () => {
          return request(app)
            .post('/api/articles/not-a-number/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed'
            })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.eql('Invalid Article Id');
            });
        });
        it('POST:404 - responds with an appropriate error message when article Id is valid but does not exist', () => {
          return request(app)
            .post('/api/articles/999/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed'
            })
            .expect(404)
            .then(res => {
              expect(res.body.message).to.eql('Article_Id Does Not Exist');
            });
        });
      });
    });
  });
});
