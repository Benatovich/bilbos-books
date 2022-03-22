const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new entry in the publishers table', async () => {
    const res = await request(app)
      .post('/api/v1/publishers')
      .send({
        name: 'Jeff',
        city: 'Buffalo',
        state: 'New York',
        country: 'US'
      });

    expect(res.body).toEqual({
      publisher_id: expect.any(String),
      name: 'Jeff',
      city: 'Buffalo',
      state: 'New York',
      country: 'US'
    });
  });
});
