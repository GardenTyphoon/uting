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
router.post('/info', function(req, res,next){
  console.log(req.body.sessionUser)
  console.log("info백")
  let ismember=false;
  Group.find(function(err,group){
    group.forEach(per=>{
      per.member.forEach(mem=>{
        if(req.body.sessionUser === mem){
          ismember=true;
          res.send(per);
        } 
      })
      
    })
    if(ismember===false){
      res.send("no")
    }

  })
  
})

// POST write one group
router.post('/', function(req, res,next){
    let exist=false;
  let foundPer;
  Group.find(function(err,group){
    group.forEach(per=>{
      per.member.forEach(mem=>{
        if(req.body.host === mem){
          console.log(mem)
          exist=true;
          foundPer=per;
        } 
      })
    })
    console.log(foundPer)
    if(exist===true){
      Group.findByIdAndUpdate(foundPer._id,{$push:{member:req.body.memberNickname}},(err,gr)=>{
          console.log(foundPer._id);
      })
    }
    if(exist===false){
      const group2 = new Group({
        member:[req.body.host,req.body.memberNickname]
      })
      group2.save((err)=>{
      res.send("그룹 생성이 완료 되었습니다.")
      })
      
    }

  })

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
