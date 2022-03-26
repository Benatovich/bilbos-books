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
    console.log('authreviews', authorsAndReviews);

    res.send(authorsAndReviews);
  });
