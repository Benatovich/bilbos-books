const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .post('/', async (req, res) => {
    console.log(req.body);
    const author = await Author.insert(req.body);
    res.send(author);
  })

  .get('/', async (req, res) => {})

  .get('/:id', async (req, res) => {});
