const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', async (req, res) => {
    const book = await Book.insert(req.body);
    res.send(book);
  })

  .get('/', async (req, res) => {
    const book = await Book.getAll();
    res.send(book);
  })

  .get('/:id', async (req, res) => {
    const book = await Book.getById(req.params.id);
    const authors = await book.getAuthors();
    const authorsAndReviews = await authors.getReviews();
    const withReviewers = authorsAndReviews.reviews.map((item) => {
      item = {
        id: item.id,
        rating: item.rating,
        review: item.review,
        reviewer: {
          id: item.reviewer_id,
          name: item.name,
        },
      };
      return item;
    });
    authorsAndReviews.reviews = withReviewers;

    const withPublisher = await authorsAndReviews.getPublisher();

    delete withPublisher.publisher_id;
    delete withPublisher.book_id;

    res.send(withPublisher);
  });
