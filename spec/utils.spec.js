const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('takes an array of items with keys of created_at and returns a new array with an amended timestamp', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const listAmended = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    const actual = formatDates(list);
    expect(actual).to.eql(listAmended);
  });
  it('function output does not mutate the original array', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const control = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    formatDates(list);
    expect(list).to.eql(control);
  });
  it('function returns an array of new objects with different reference points to the original input', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    const control = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(list[0]).to.not.equal(formatDates(list)[0]);
  });
});

describe('makeRefObj', () => {
  it('returns an object of desired key value combinations when passed an array of data', () => {
    const data = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: '2002-11-19T12:21:54.171Z'
      }
    ];
    const actual = makeRefObj(data, 'article_id', 'title');
    expect(actual).to.eql({
      5: 'UNCOVERED: catspiracy to bring down democracy'
    });
    expect(actual).to.be.an('object');
  });
  it('function does not mutate input array', () => {
    const data = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: '2002-11-19T12:21:54.171Z'
      }
    ];
    const control = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: '2002-11-19T12:21:54.171Z'
      }
    ];
    makeRefObj(data, 'title', 'article_id');
    expect(data).to.eql(control);
  });
  it('function returns an array of new objects with different reference points to the original input', () => {
    const data = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: '2002-11-19T12:21:54.171Z'
      }
    ];
    const control = [
      {
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        votes: 0,
        topic: 'cats',
        author: 'rogersop',
        created_at: '2002-11-19T12:21:54.171Z'
      }
    ];
    expect(data[0]).to.not.equal(makeRefObj(data, 'article_id', 'title')[0]);
  });
});

describe('formatComments', () => {
  it('returns an array of formatted objects when passed a reference object and an array of comment data requiring formatting', () => {
    const refObj = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      'Student SUES Mitch!': 4,
      'UNCOVERED: catspiracy to bring down democracy': 5,
      A: 6,
      Z: 7,
      'Does Mitch predate civilisation?': 8,
      "They're not exactly dogs, are they?": 9,
      'Seven inspirational thought leaders from Manchester UK': 10,
      'Am I a cat?': 11,
      Moustache: 12
    };
    const comment = [
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const amended = [
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        article_id: 1,
        author: 'icellusedkars',
        votes: 100,
        created_at: new Date(1448282163389)
      }
    ];
    const actual = formatComments(comment, refObj);
    expect(actual).to.eql(amended);
  });
  it('returns a new array that does not mutate the original input data', () => {
    const refObj = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      'Student SUES Mitch!': 4,
      'UNCOVERED: catspiracy to bring down democracy': 5,
      A: 6,
      Z: 7,
      'Does Mitch predate civilisation?': 8,
      "They're not exactly dogs, are they?": 9,
      'Seven inspirational thought leaders from Manchester UK': 10,
      'Am I a cat?': 11,
      Moustache: 12
    };
    const comment = [
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const control = [
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const actual = formatComments(comment, refObj);
    expect(comment).to.eql(control);
    expect(actual).to.not.equal(comment);
  });
  it('function returns an array of new objects with different reference points to the original input', () => {
    const refObj = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      'Student SUES Mitch!': 4,
      'UNCOVERED: catspiracy to bring down democracy': 5,
      A: 6,
      Z: 7,
      'Does Mitch predate civilisation?': 8,
      "They're not exactly dogs, are they?": 9,
      'Seven inspirational thought leaders from Manchester UK': 10,
      'Am I a cat?': 11,
      Moustache: 12
    };
    const comment = [
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expect(comment[0]).to.not.equal(formatComments(comment, refObj)[0]);
  });
});
