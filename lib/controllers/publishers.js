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
    console.log('reqparams', req.params);
    const publisher = await Publisher.getById(req.params.id);
    res.json(publisher);
  });
