const { Router } = require('express');
const Publisher = require('../models/Publisher');

module.exports = Router()
  .post('/', async (req, res) => {
    const publisher = await Publisher.insert(req.body);
    res.send(publisher);
  })

  .get('/', async (req, res) => {
    const publisher = await Publisher.getAll(req.body);
    res.json(publisher);
  })

  .get('/:id', async (req, res) => {
    const publisher = await Publisher.getById(req.params.id, req.body);
    res.json(publisher);
  });
