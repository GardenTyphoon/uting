var express = require('express');
var router = express.Router();
const { Group }=require('../model');

// GET groups list 
router.get('/', async function(req, res, next) {
  const groups = await Group.find();
  //res.json(groups);
});

// GET one group
router.get('/:id', async function(req, res, next) {
  const group = await Group.findOne({_id:req.params.id});
  //res.json(group);
});

// POST write one group
router.post('/', function(req, res,next){
  const group = new Group(req.body);
  group.save();
  //res.json(group);
})

// PUT edit one group
router.put('/:id', async function(req,res,next){
  const group = await Group.findByIdAndUpdate(req.params.id, req.body);
  //res.json(group);
})

// DELETE one group
router.delete('/:id', async function(req,res,next){
  const group = await Group.deleteOne({_id : req.params.id});
  //res.json(group);
});

module.exports = router;
