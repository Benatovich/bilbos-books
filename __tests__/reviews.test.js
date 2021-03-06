const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Review = require('../lib/models/Review');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new review', async () => {
    const review = {
      reviewer_id: '1',
      book_id: '1',
      rating: 5,
      review: 'This was the best book I have ever read!',
    };

    const res = await request(app).post('/api/v1/reviews').send(review);

    expect(res.body).toEqual({ review_id: expect.any(String), ...review });
  });

  it('should list all reviews up to the top 100', async () => {
    const res = await request(app).get('/api/v1/reviews');

    expect(res.body).toEqual([
      {
        review_id: expect.any(String),
        rating: 3,
        review: 'okay',
        book_id: '1',
        title: 'hi',
      },
      {
        review_id: expect.any(String),
        rating: 1,
        review: 'nice',
        book_id: '1',
        title: 'hi',
      },
    ]);

    for (let i = 0; i < 101; i++) {
      await Review.insert({
        reviewer_id: '1',
        book_id: '1',
        rating: 2,
        review: 'This book sucked! Boo :(',
      });
    }
    const res2 = await request(app).get('/api/v1/reviews');
    expect(res2.body.length).toEqual(100);
    expect(res2.body.length).not.toBeGreaterThan(100);
  });

  it('should be able to delete reviews', async () => {
    const review = await Review.insert({
      reviewer_id: '2',
      book_id: '4',
      rating: 3,
      review: 'This book was mid :/',
    });

    const getAllReviews = await Review.getAll();

    const res = await request(app).delete(
      `/api/v1/reviews/${review.review_id}`
    );

    expect(res.body).toEqual(review);
    const getAll2 = await Review.getAll();
    expect(getAll2.length).toEqual(getAllReviews.length - 1);
  });
});
