const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to insert a single instance of Author to authors', async () => {
    const res = await request(app).post('/api/v1/authors').send({
      name: 'Chuck Palahniuk',
      dob: '4/3/1992',
      pob: 'Portland, OR',
    });

    expect(res.body).toEqual({
      author_id: expect.any(String),
      name: 'Chuck Palahniuk',
      dob: '4/3/1992',
      pob: 'Portland, OR',
    });
  });
});
