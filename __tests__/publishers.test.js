const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher');
const Book = require('../lib/models/Book');

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
    await Publisher.insert({
      name: 'Hank',
      city: 'austin',
      state: 'texas',
      country: 'US',
    });

    const res = await request(app).get('/api/v1/publishers');

    expect(res.body).toEqual([
      {
        publisher_id: expect.any(String),
        name: 'sam',
      },
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
    });

    const book = await Book.insert({
      publisher_id: 2,
      title: 'Invisible Monsters',
      released: 2000,
    });

    const res = await request(app).get(
      `/api/v1/publishers/${expected.publisher_id}`
    );

    expect(res.body).toEqual({
      publisher_id: '2',
      name: 'Hank',
      city: 'Buffalo',
      state: 'New York',
      country: 'US',
      books: [
        {
          id: '2',
          title: 'Invisible Monsters',
        },
      ],
    });
  });
});
