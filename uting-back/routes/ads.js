var express = require('express');
var router = express.Router();
const { Ad }=require('../model');

// GET ads list 
router.get('/', async function(req, res, next) {
  const ads = await Ad.find();
  //res.json(ads);
});

// GET one ad
router.get('/:id', async function(req, res, next) {
  const ad = await Ad.findOne({_id:req.params.id});
  //res.json(ad);
});

// POST write one ad
router.post('/', function(req, res,next){
  const ad = new Ad(req.body);
  ad.save();
  //res.json(ad);
})

// PUT edit one ad
router.put('/:id', async function(req,res,next){
  const ad = await Ad.findByIdAndUpdate(req.params.id, req.body);
  //res.json(ad);
})

// DELETE one ad
router.delete('/:id', async function(req,res,next){
  const ad = await Ad.deleteOne({_id : req.params.id});
  //res.json(ad);
});

module.exports = router;
