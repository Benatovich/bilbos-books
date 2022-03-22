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
    const res = await request(app).post('/api/v1/publishers').send({
      name: 'Jeff',
      city: 'Buffalo',
      state: 'New York',
      country: 'US',
    });

    expect(res.body).toEqual({
      publisher_id: expect.any(String),
      name: 'Jeff',
      city: 'Buffalo',
      state: 'New York',
      country: 'US',
    });
  });

  it('gets a list of publishers', async () => {
    //TODO: account for books
    await Publisher.insert({
      name: 'Hank',
      city: 'Buffalo',
      state: 'New York',
      country: 'US',
    });

    const res = await request(app).get('/api/v1/publishers');

    expect(res.body).toEqual([
      {
        publisher_id: expect.any(String),
        name: 'Hank',
      },
    ]);
  });

  it('gets a publisher by id', async () => {
    const expected = await Publisher.insert({
      name: 'Hank',
      city: 'Buffalo',
      state: 'New York',
      country: 'US',
      // books: [
      //   {
      //     book_id: 1,
      //     title: 'book',
      //   },
      // ],
    });

    const res = await request(app).get(
      `/api/v1/publishers/${expected.publisher_id}`
    );

    expect(res.body).toEqual(expected);
  });
});
