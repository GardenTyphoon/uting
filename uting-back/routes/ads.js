var express = require('express');
var router = express.Router();
const { Ad }=require('../model');

router.post('/save', function(req,res,next){
  console.log(req.body)
  const ad = new Ad({
    type:req.body.type,
    name:req.body.name,
    email:req.body.email,
    file:req.body.file,
    contents:req.body.contents,
  });

  ad.save((err) => {
    res.send("요청완료");
  });

})


module.exports = router;
