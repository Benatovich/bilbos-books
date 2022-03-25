const { Router } = require('express');
const Review = require('../models/Review');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .post('/', async (req, res) => {
    const reviewer = await Reviewer.insert(req.body);
    res.send(reviewer);
  })

  .get('/', async (req, res) => {
    const reviewer = await Reviewer.getAll();
    res.send(reviewer);
  })

  .get('/:id', async (req, res) => {
    const reviewer = await Reviewer.getById(req.params.id);
    const reviewerAndReview = await reviewer.getReviews();
    res.send(reviewerAndReview);
  })

  .patch('/:id', async (req, res) => {
    const reviewer = await Reviewer.updateById(req.params.id, req.body);
    console.log('req.params', req.params.id, req.body);
    await reviewer.getReviews();
    console.log('reviewsToo', reviewer);
    res.send(reviewer);
  })

  .delete('/:id', async (req, res, next) => {
    try {      
      const reviewer = await Reviewer.deleteById(req.params.id);
      res.send(reviewer);
    } 
    // console.log('REQ', req.params.id);
    catch(error) {
      next(error);
    }
    
  });

