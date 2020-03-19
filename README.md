# NC-NEWS

I have created the backend API to allow users to interact with my NC-NEWS database which provides data on articles, users, comments and topics using a variety of end points to access this data on my API.

## Getting Started

In order to set this project up on you local machine you will need to install a number of npm package dependencies to allow for connection to the database and for testing purposes:

###### npm i -D express

*express
*supertest
*knex
*pg
*mocha
*chai
\*chai-sorted
In order to set up a development environment and connect to the dev database, you will need to enter into the project command line: npm run seed-dev. This will seed the dev database and connect you to it at the same time.

## Running The Tests

Once you have installed all the dependencies you can run tests on the project to test the current endpoints or to check any further endpoints or util functions added. An example test would be in the format below where endpoints are separated by describe blocks:

```javascript
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
```

The above tests for a GET request along the /api/topics endpoint and the format of the response to the user.
run test suites using:

###### npm test

Testing is done on all successful available endpoints and the associating errors that appear during requests on these endpoints.
