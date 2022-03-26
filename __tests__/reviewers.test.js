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
      {
        reviewer_id: expect.any(String),
        name: 'Jeff',
        company: 'No Books'
      },
      { ...reviewer },
    ]);
  });

  it('gets a reviewer by id', async () => {
    const reviewer = await Reviewer.insert({
      name: 'Sam',
      company: 'No Books',
    });

    await Review.insert({
      rating: 5,
      review: 'book slaps',
      book_id: '1',
      book_title: 'hi',
      reviewer_id: reviewer.reviewer_id,
    });

    const res = await request(app).get(
      `/api/v1/reviewers/${reviewer.reviewer_id}`
    );

    expect(res.body).toEqual(
      {
        name: 'Sam',
        company: 'No Books',
        reviewer_id: expect.any(String),
        review: [
          {
            id: '3',
            rating: 5,
            review: 'book slaps',
            book_id: '1',
            title: 'hi'
          }]
      },
    );
  });

  it('updates reviewer', async () => {
    // insert a Reviewer whose reviewer_id should be 3
    const reviewer = await Reviewer.insert({
      name: 'Ryan',
      company: 'One Book'
    });
    
    // insert a Review with a review_id of 2, book_id 1 should have the title "hi"
    await Review.insert({
      reviewer_id: '3',
      book_id: '1',
      rating: 3,
      review: 'okay',
    });

    const res = await request(app)
      .patch(`/api/v1/reviewers/${reviewer.reviewer_id}`)
      .send({
        company: 'Two Books'
      });
    
    const expected = {
      reviewer_id: expect.any(String),
      name: 'Ryan',
      company: 'Two Books',
      review: [{
        id: '3',
        book_id: '1',
        rating: 3,
        review: 'okay',
        title: 'hi'
      }]

    };
      
    expect(res.body).toEqual(expected);
    const response2 = await request(app)
      .get(`/api/v1/reviewers/${reviewer.reviewer_id}`);

    expect(response2.body).toEqual(expected);
  });

  it('deletes a reviewer if they have no reviews', async () => {
    // const reviewer = await Reviewer.insert({
    //   name: 'Beth',
    //   company: 'Books for Cats'
    // });

    const res = await request(app)
      .delete('/api/v1/reviewers/1');

    console.log('test', res.body);
    expect(res.body.message).toEqual('reviewer with reviews can not be deleted');
    

  });
});
