const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a book', async () => {
    const book = ({
      title: 'Test',
      publisher_id: '90',
      released: 1995
    });

    const res = await request(app)
      .post('/api/v1/books')
      .send(book);

    expect(res.body).toEqual({
      book_id: expect.any(String), ...book });
  });

  it('gets all books', async () => {
    const book = await Book.insert({
      title: 'Test',
      publisher_id: '90',
      released: 1995
    });

    const res = await request(app)
      .get('/api/v1/books');

    expect(res.body).toEqual([
      {  
        book_id: '1', 
        publisher_id: '1', 
        released: 1922, 
        title: 'hi' 
      }, {
        book_id: expect.any(String), ...book
      }]);
  });

  it('gets a book by id', async () => {
    const book = await Book.insert({
      title: 'Test',
      publisher_id: 1,
      released: 1995
    });

    const res = await request(app)
      .get(`/api/v1/books/${book.book_id}`);

    expect(res.body).toEqual({
      book_id: book.book_id, ...book
    });
  });
});
