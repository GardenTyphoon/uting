var express = require('express');
var router = express.Router();
const { Mc }=require('../model');

router.post('/', function(req, res,next){
    const mc = new Mc({
        type:req.body.type,
        content:req.body.content
    })
    mc.save((err)=>{
        res.send("저장완료")
    })
})

router.post('/list', function(req, res,next){
    let list = [];
    Mc.find(function (err, mc) {
        mc.forEach((one) => {
          if (req.body.type === one.type) {
              list.push(one.content)

          }
        });
        console.log("list",list)
        res.send(list)
        
    });
})





module.exports = router;
