var express = require('express');
var router = express.Router();
const { Meeting }=require('../model');

// GET meetings list 
router.get('/', async function(req, res, next) {
  const meetings = await Meeting.find();
  //res.json(meetings);
});

// GET one meeting
router.get('/:id', async function(req, res, next) {
  const meeting = await Meeting.findOne({_id:req.params.id});
  //res.json(meeting);
});

// POST write one meeting
router.post('/', function(req, res,next){
  const meeting = new Meeting(req.body);
  meeting.save();
  //res.json(meeting);
})

// PUT edit one meeting
router.put('/:id', async function(req,res,next){
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body);
  //res.json(meeting);
})

// DELETE one meeting
router.delete('/:id', async function(req,res,next){
  const meeting = await Meeting.deleteOne({_id : req.params.id});
  //res.json(meeting);
});

module.exports = router;
