const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', async (req, res) => {
    console.log(req.body);
        
    const reviewer = await Reviewer.insert(req.body);
    res.send(reviewer);
  })

  .get('/', async (req, res) => {
    const reviewer = await Reviewer.getAll();
    res.send(reviewer);
  });
