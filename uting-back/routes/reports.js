var express = require('express');
var router = express.Router();
const { Report }=require('../model');



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

router.get('/', async function(req, res, next) {
  Report.find({}).then((report)=>{ 
    res.json(report);
  }).catch((err) => {
    res.send(err);
  });
});

router.post('/delete', async function(req,res,next){
  Report.deleteOne({_id : req.body._id}).then(
    res.send("success")
  )
  
  //res.json(ad);
});

module.exports = router;
