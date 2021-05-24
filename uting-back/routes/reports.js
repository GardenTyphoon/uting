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
router.post('/saveReport', function(req,res,next){
  
  const report = new Report({
    target:req.body.reportTarget,
    content:req.body.reportContent,
    requester:req.body.reportRequester,
  });

  report.save();
  res.send("신고가 정상적으로 접수되었습니다.")

  //res.json(report);
})
// DELETE one report
router.delete('/:id', async function(req,res,next){
  const report = await Report.deleteOne({_id : req.params.id});
  //res.json(report);
});

module.exports = router;
