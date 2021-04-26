var express = require('express');
var router = express.Router();
const { Group } = require('../model');
const { User } = require('../model');

router.post('/getMyGroup', function (req, res, next) {
    Group.find(function (err, group) {
        group.forEach(gr => {
           
            if (req.body.groupId === gr._id.toString()) {
               
                res.send(gr.group_members_id);
            }
        })
    })
})
// POST write one group
router.post('/info', function(req, res,next){
    console.log(req.body.sessionUser)
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
    let memID=[];
    let newMemId;
    User.find(function(err,user){
        user.forEach(per=>{
            if(req.body.host===per.nickname){
                memID.push(per._id);
            }
            if(req.body.memberNickname===per.nickname){
                memID.push(per._id);
                newMemId=per._id;
            }
        })
    })

    Group.find(function(err,group){
      group.forEach(per=>{
        per.member.forEach(mem=>{
          if(req.body.host === mem){
            console.log(mem)
            exist=true;
            foundPer=per;
            memID=[newMemId]
          } 
        })
      })
      console.log(foundPer)
      if(exist===true){
        console.log(memID)
        Group.findByIdAndUpdate(foundPer._id,{$push:{member:req.body.memberNickname,group_members_id:memID}},(err,gr)=>{
            console.log(foundPer._id);
        })
      }
      if(exist===false){
        const group2 = new Group({
          member:[req.body.host,req.body.memberNickname],
          group_members_id:memID
        })
        group2.save((err)=>{
        res.send("그룹 생성이 완료 되었습니다.")
        })
      }
  
    })
  
  })
module.exports = router;