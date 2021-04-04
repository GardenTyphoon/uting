var express = require('express');
var router = express.Router();
const { Report }=require('../model');

// GET reports list 
router.get('/', async function(req, res, next) {
  const reports = await Report.find();
  //res.json(reports);
});

// GET one report
router.get('/:id', async function(req, res, next) {
  const report = await Report.findOne({_id:req.params.id});
  //res.json(report);
});

// POST write one report
router.post('/', function(req, res,next){
  const report = new Report(req.body);
  report.save();
  //res.json(report);
})

// PUT edit one report
router.put('/:id', async function(req,res,next){
  const report = await Report.findByIdAndUpdate(req.params.id, req.body);
  //res.json(report);
})

// DELETE one report
router.delete('/:id', async function(req,res,next){
  const report = await Report.deleteOne({_id : req.params.id});
  //res.json(report);
});

module.exports = router;
