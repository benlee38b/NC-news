process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../connection');
const chaiSorted = require('chai-sorted');
const chai = require('chai');

chai.use(chaiSorted);

beforeEach(() => {
  return connection.seed.run();
});
after(() => {
  return connection.destroy();
});

describe('/api', () => {
  it('GET:200 - responds with an object of all the available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints.endpoints).to.eql({
          1: '/api',
          2: '/api/topics',
          3: '/api/users/:username',
          4: '/api/articles',
          5: '/api/articles/:article_id',
          6: '/api/articles/:article_id/comments',
          7: '/api/comments/:comment_id',
        });
      });
  });
  it('status:405 when invalid methods applied to path', () => {
    const invalidMethods = ['patch', 'put', 'post', 'delete'];
    const methodPromises = invalidMethods.map((method) => {
      return request(app)
        [method]('/api')
        .expect(405)
        .then(({ body: { message } }) => {
          expect(message).to.equal('method not allowed');
        });
    });
    return Promise.all(methodPromises);
  });

  describe('/topics', () => {
    it('GET: 200 - responds with an array of all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topics[0]).to.contain.keys('slug', 'description');
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
        });
    });

    it('status:405 when invalid methods applied to path', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
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
        .then((res) => {
          expect(res.body.message).to.equal('404: File Not Found');
        });
    });
  });
  describe('/user', () => {
    describe('/:username', () => {
      it('GET:200 - responds with a user object based on the username provided in the params', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then((res) => {
            expect(res.body.user).to.eql({
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
            });
          });
      });
      it('GET:404 - responds with an appropriate error message when the provided username does not exist', () => {
        return request(app)
          .get('/api/users/cheeze_wizz')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql('Username Does Not Exist');
          });
      });
      it('GET:400 - responds with an appropriate error message when the provided username is not valid', () => {
        return request(app)
          .get('/api/users/:::::')
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql('Username Not valid');
          });
      });
      it('status:405 when invalid methods applied to path', () => {
        const invalidMethods = ['patch', 'put', 'post', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users/butter_bridge')
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
    it('GET:200 - responds with an array of articles objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles[0]).to.be.an('object');
          expect(res.body.articles[0]).to.contain.keys(
            'author',
            'title',
            'topic',
            'created_at',
            'votes',
            'comment_count',
            'total_count'
          );
        });
    });
    it('GET:200 - responds with an array of articles objects sorted by votes in default order of descending', () => {
      return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.descendingBy('votes');
        });
    });
    it('GET:200 - responds with an array of articles limited by the limit in the query value', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).to.eql(5);
        });
    });
    it('GET:200 - responds with an array of articles corresponding to the current page query used in the end point', () => {
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).to.equal(2);
        });
    });
    it('GET:400 - responds with an appropriate error message when sort_by column in query does not exist', () => {
      return request(app)
        .get('/api/articles?sort_by=cheese')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.eql('Invalid query input');
        });
    });
    it('GET:200 - responds with an array of articles objects sorted by votes in ascending order', () => {
      return request(app)
        .get('/api/articles?sort_by=votes&order=ASC')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.ascendingBy('votes');
        });
    });
    it('GET:200 - responds with an array of articles objects filtered by author username', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article.author).to.eql('butter_bridge');
          });
        });
    });
    it('GET:404 - responds with an appropriate error message when username in query does not exist', () => {
      return request(app)
        .get('/api/articles?author=abasaf')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.eql('Username Does Not Exist');
        });
    });
    it('GET:200 - responds with an array of articles objects filtered by topic specified in the query', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article.topic).to.eql('mitch');
          });
        });
    });

    it('GET:404 - responds with an appropriate error message when topic in query does not exist', () => {
      return request(app)
        .get('/api/articles?topic=abasaf')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.eql('Topic Does Not Exist');
        });
    });
    it('status:405 when invalid methods applied to path', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });

    describe('/:article_id', () => {
      it('GET:200 - responds with an article object of the article matching the article_id passed into the params', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article.article_id).to.equal(1);
          });
      });
      it('GET:200 - returned article object has a key of comment_count totaling the comments attached to the passed article_id', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article.comment_count).to.equal('13');
          });
      });
      it('GET:404 - responds with an appropriate error message when the article_id cannot be found', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql('Article_id Not Found');
          });
      });
      it('GET:400 - responds with an appropriate error message when the article_id is not valid', () => {
        return request(app)
          .get('/api/articles/not-a-number')
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql('Article_id Not Valid');
          });
      });
      it('PATCH:200 - responds with an article object with the votes key incremented by a value stated in the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 50 })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).to.eql(150);
          });
      });
      it('GET:400 - responds with an appropriate error message when inc_votes not included on the body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then((res) => {
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
          .then((res) => {
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
          .then((res) => {
            expect(res.body.message).to.eql('Invalid Article Id');
          });
      });
      it('GET:404 - responds with an appropriate error message when article Id is not found', () => {
        return request(app)
          .patch('/api/articles/999')
          .send({ inc_votes: 50 })
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql('Article_Id Not Found');
          });
      });
      it('status:405 when invalid methods applied to path', () => {
        const invalidMethods = ['put', 'post', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles/1')
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('/comments', () => {
        it('POST:201 - responds with an object of the comment', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed',
            })
            .expect(201)
            .then((res) => {
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
                'what an awful article you have written you should be ashamed',
            })
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql('Missing Required Fields');
            });
        });
        it('POST:400 - responds with an appropriate error message article_id is not valid', () => {
          return request(app)
            .post('/api/articles/not-a-number/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed',
            })
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql('Invalid Article Id');
            });
        });
        it('POST:404 - responds with an appropriate error message when article Id is valid but does not exist', () => {
          return request(app)
            .post('/api/articles/999/comments')
            .send({
              username: 'butter_bridge',
              body:
                'what an awful article you have written you should be ashamed',
            })
            .expect(404)
            .then((res) => {
              expect(res.body.message).to.eql('Article_Id Does Not Exist');
            });
        });
        it('GET:200 - responds with an array of comment objects', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((res) => {
              expect(res.body.comments.data).to.be.an('array');
              expect(res.body.comments.data[0]).to.be.an('object');
              expect(res.body.comments.data[0]).to.contain.keys(
                'comment_id',
                'votes',
                'created_at',
                'author',
                'body',
                'total_count'
              );
            });
        });
        it('GET:200 - responds with an array of comment objects sorted by votes in descending order by default', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=votes')
            .expect(200)
            .then((res) => {
              expect(res.body.comments.data).to.be.descendingBy('votes');
            });
        });
        it('GET:200 - responds with an array of comments with a length limited by a query value', () => {
          return request(app)
            .get('/api/articles/1/comments?limit=5')
            .expect(200)
            .then((res) => {
              expect(res.body.comments.data.length).to.equal(5);
            });
        });

        it('GET:200 - responds with a blank array when the article_id exists but has no attached comments', () => {
          return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((res) => {
              expect(res.body.comments).to.eql([]);
            });
        });
        it('GET:200 - responds with an array of comment objects sorted by comment_id in ascending order', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
            .expect(200)
            .then((res) => {
              expect(res.body.comments.data).to.be.ascendingBy('comment_id');
            });
        });
        it('GET:404 - responds with an appropriate error message when article Id is valid but does not exist', () => {
          return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then((res) => {
              expect(res.body.message).to.eql('Article_Id Does Not Exist');
            });
        });

        it('GET:400 - responds with an appropriate error message when sort_by column does not exist', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=cheese')
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql('Invalid query value');
            });
        });
        it('GET:400 - responds with an appropriate error message when order value in query is not valid', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=votes&order=cheese')
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql('Invalid query value');
            });
        });
        it('status:405 when invalid methods applied to path', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/articles/1/comments')
              .expect(405)
              .then(({ body: { message } }) => {
                expect(message).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      it('PATCH: 200', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({ inc_votes: 20 })
          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).to.eql(34);
          });
      });
      it('PATCH: 400 responds with an appropriate error message when comment_id is not valid', () => {
        return request(app)
          .patch('/api/comments/not-a-number')
          .send({ inc_votes: 20 })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql('Comment_id is not valid');
          });
      });
      it('PATCH: 404 - responds with an appropriate error message when comment_id is not found', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 20 })
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql('Comment_id Not Found');
          });
      });
      it('PATCH:400 - responds with an appropriate error message when inc_votes missing from the request body', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({})
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql('Missing Required Fields');
          });
      });
      it('PATCH:400 - responds with an appropriate error message when inc_votes value is invalid', () => {
        return request(app)
          .patch('/api/comments/999')
          .send({ inc_votes: 'not-a-number' })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql('Increment Value Invalid');
          });
      });
      it('DELETE:204 - responds with no body and a status of 204', () => {
        return request(app)
          .delete('/api/comments/2')
          .expect(204)
          .then((res) => {
            expect(res.body).to.eql({});
          });
      });
      it('DELETE: 404 - responds with an appropriate error message when comment_id is not found', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql('Comment_id Not Found');
          });
      });
      it('status:405 when invalid methods applied to path', () => {
        const invalidMethods = ['get', 'put', 'post'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/comments/1')
            .expect(405)
            .then(({ body: { message } }) => {
              expect(message).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
