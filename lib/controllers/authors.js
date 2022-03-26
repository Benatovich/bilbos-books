const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .post('/', async (req, res) => {
    const author = await Author.insert(req.body);
    res.send(author);
  })

  .get('/', async (req, res) => {
    const authors = await Author.getAll();
    res.send(authors);
  })

  .get('/:id', async (req, res) => {
    const author = await Author.getById(req.params.id);
    const books = await author.getBooks();
    delete books.author_id;
    res.send(books);
  });
