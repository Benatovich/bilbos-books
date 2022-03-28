const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');
const Review = require('../lib/models/Review');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a book', async () => {
    const book = {
      title: 'Test',
      publisher_id: '90',
      released: 1995,
    };

    const res = await request(app).post('/api/v1/books').send(book);

    expect(res.body).toEqual({
      book_id: expect.any(String),
      ...book,
    });
  });

  it('gets all books', async () => {
    const book = await Book.insert({
      title: 'Test',
      publisher_id: '90',
      released: 1995,
    });

    const res = await request(app).get('/api/v1/books');

    expect(res.body).toEqual([
      {
        book_id: '1',
        publisher_id: '1',
        released: 1922,
        title: 'hi',
      },
      {
        book_id: expect.any(String),
        ...book,
      },
    ]);
  });

  it('gets a book by id', async () => {
    const res = await request(app).get('/api/v1/books/1');

    expect(res.body).toEqual({
      title: 'hi',
      released: 1922,
      publisher: {
        id: '1',
        name: 'sam',
      },
      author: [
        {
          author_id: '1',
          name: 'ryan',
        },
      ],
      reviews: [
        {
          id: '1',
          rating: 1,
          review: 'nice',
          reviewer: {
            name: 'Denzel',
            id: '1',
          },
        },
        {
          id: '2',
          rating: 3,
          review: 'okay',
          reviewer: {
            name: 'Jeff',
            id: '2',
          },
        },
      ],
    });
  });
});
