var express = require('express');
var router = express.Router();
const { Group } = require('../model');



router.post('/getMyGroupMember', function (req, res, next) {
  let isMember=false;  
  Group.find(function (err, group) {
      group.forEach(gr => {
        gr.member.forEach(nickname=>{
          if (req.body.sessionUser === nickname) {
            isMember=true;
            res.send(gr.member);
            }
          
        })
      })
      if(isMember===false) res.send("no");
    })
})

// POST write one group
router.post('/info', function(req, res,next){
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
        res.send("no");
      }
  
    })
    
  })
  
  // POST write one group
  router.post('/', function(req, res,next){

    let exist=false;
    let foundPer;
    let memList=[];
    
    Group.find(function(err,group){
      group.forEach(per=>{
        per.member.forEach(mem=>{
          if(req.body.host === mem){
            exist=true;
            foundPer=per;
          } 
        })
      })
      if(exist===true){
        foundPer.member.push(req.body.memberNickname)
        Group.findByIdAndUpdate(foundPer._id,{$set:{member:foundPer.member}},(err,gr)=>{
            res.send(foundPer._id);
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
  router.post('/leaveGroup', function(req,res,next){

    let check=false;
    console.log(req.body.userNickname)
    Group.find(function(err,group){
      
      group.forEach(gr=>{
        gr.member.forEach(mem=>{
          console.log(gr._id);
          if(req.body.userNickname===mem){
            console.log(gr._id);
            Group.findByIdAndUpdate(gr._id, {$pull:{member:{$in:[req.body.userNickname]}}}, (err)=>{});
            check=true;
          }
        })
        console.log(gr.member.length);
        if(gr.member.length===2 && check===true){
          Group.findByIdAndDelete(gr._id, (err)=>{});
        }
        check=false;
      })
      
    })

  });
module.exports = router;