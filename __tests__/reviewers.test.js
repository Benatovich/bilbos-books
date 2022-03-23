const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a reviewer', async () => {
    const reviewer = ({
      name: 'Ernie',
      company: 'Good Books'
    });

    const res = await request(app)
      .post('/api/v1/reviewers')
      .send(reviewer);

    expect(res.body).toEqual({ reviewer_id: expect.any(String), ...reviewer });
  });


  it('gets all reviewers', async () => {
    const reviewer = await Reviewer.insert({
      name: 'Olivia',
      company: 'All the Books'
    });

    const res = await request(app)
      .get('/api/v1/reviewers');

    expect(res.body).toEqual([{ 
      reviewer_id: expect.any(String),
      name: 'Denzel',
      company: 'Most Books'
    }, { ...reviewer }]);

  });

});



