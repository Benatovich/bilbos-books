const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');

describe('bilbos-books routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a reviewer', async () => {
    const reviewer = {
      name: 'Ernie',
      company: 'Good Books',
    };

    const res = await request(app).post('/api/v1/reviewers').send(reviewer);

    expect(res.body).toEqual({ reviewer_id: expect.any(String), ...reviewer });
  });

  it('gets all reviewers', async () => {
    const reviewer = await Reviewer.insert({
      name: 'Olivia',
      company: 'All the Books',
    });

    const res = await request(app).get('/api/v1/reviewers');

    expect(res.body).toEqual([
      {
        reviewer_id: expect.any(String),
        name: 'Denzel',
        company: 'Most Books',
      },
      { ...reviewer },
    ]);
  });

  it('gets a reviewer by id', async () => {
    const reviewer = await Reviewer.insert({
      name: 'Sam',
      company: 'No Books',
    });

    const review = await Review.insert({
      rating: 5,
      review: 'book slaps',
      book_id: '1',
      book_title: 'The Communist Manifesto',
      reviewer_id: reviewer.reviewer_id,
    });

    const res = await request(app).get(
      `/api/v1/reviewers/${reviewer.reviewer_id}`
    );

    expect(res.body).toEqual([
      {
        reviewer_id: expect.any(String),
        ...reviewer,
        ...review,
      },
    ]);
  });

  //   it('updates reviewer', async () => {
  //     const reviewer = await Reviewer.insert({
  //       name: 'Ryan',
  //       company: 'One Book'
  //     });

  //     const res = await request(app)
  //         .patch(`/api/v1/${reviewer.reviewer_id}`)
  //         .
  //   })
});
