var express = require('express');
var router = express.Router();
const { Meeting }=require('../model');

const fs = require('fs');
const {v4:uuid} = require('uuid');
const AWS = require('aws-sdk');
// const { response } = require('express');
/* eslint-enable */

// let hostname = '127.0.0.1';
// let port = 8080;
// let protocol = 'http';
// let options = {};

const chime = new AWS.Chime({ region: 'us-east-1' });
const alternateEndpoint = process.env.ENDPOINT;
if (alternateEndpoint) {
  console.log('Using endpoint: ' + alternateEndpoint);
  chime.createMeeting({ ClientRequestToken: uuid() }, () => {});
  AWS.NodeHttpClient.sslAgent.options.rejectUnauthorized = false;
  chime.endpoint = new AWS.Endpoint(alternateEndpoint);
} else {
  chime.endpoint = new AWS.Endpoint(
    'https://service.chime.aws.amazon.com/console'
  );
}

// @TODO 밑에 캐시 두 개 데이터 베이스에 넣어서 관리하면 될 것 같습니둥
const meetingCache = {};
const attendeeCache = {};

const log = message => {
  console.log(`${new Date().toISOString()} ${message}`);
};

const app = process.env.npm_config_app || 'meeting';


// GET meetings list 
router.get('/', async function(req, res, next) {
  Meeting.find({}).then((meetings)=>{ 
    res.json(meetings);
  }).catch((err) => {
    res.send(err);
  });
});


// getAttendee
router.post('/attendee', async function (req, res, next) {
  // const meeting = await Meeting.findOne({ _id: req.params.id });
  console.log("Attendee!!!!!!!!!")
  console.log(req.body)
  const title = req.body.meetingId;
  const attendee = req.body.attendee;

  const attendeeInfo = {
    
      AttendeeId: attendee,
      Name: attendeeCache[title][attendee]
  
  };
  res.send(JSON.stringify(attendeeInfo))
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(attendeeInfo), 'utf8');
  res.end();

  console.log(req.query.title)
  console.log(req.query.attendee)
});

// POST write one meeting
router.post('/', function(req, res,next){

  const meeting = new Meeting({
    title:req.body.title,
    maxNum:req.body.maxNum,
    status:req.body.status,
    avgManner:req.body.avgManner,
    avgAge:req.body.avgAge,
    users:req.body.users,
    numOfWoman:req.body.numOfWoman,
    numOfMan : req.body.numOfMan,
    sumManner: req.body.sumManner,
    sumAge: req.body.sumAge,
  });
  meeting.save((err)=>{
    res.send("방을 생성하였습니다.")
  });
})

// POST CHIME one meeting
router.post('/join', async function(req, res, next){


  const temp_room = await Meeting.findOne({title:req.body.title});
  console.log('what meetingroom data')
  console.log(temp_room)
  const meeting = new Meeting({
    title:req.body.title,
    maxNum:req.body.maxNum,
    status:req.body.status,
    avgManner:req.body.avgManner,
    avgAge:req.body.avgAge,
    users:req.body.users,
    numOfWoman:req.body.numOfWoman,
    numOfMan : req.body.numOfMan
  });
  meeting.save();


  const title = req.body.title;
  const name = req.body.session;
  const region = "us-east-1"
  
  if (!meetingCache[title]){
    meetingCache[title] = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: region
      }).promise();
      attendeeCache[title] = {};
  }
  const joinInfo = {
    JoinInfo: {
      Title: title,
      Meeting: meetingCache[title].Meeting,
      Attendee: (
        await chime
          .createAttendee({
            MeetingId: meetingCache[title].Meeting.MeetingId,
            ExternalUserId: uuid()
          }).promise()).Attendee
    }
  };
  attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;

  
  
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(joinInfo), 'utf8');
  // meeting.save((err) => {
  //   res.send("방을 생성하였습니다.")
  // });
  res.end(); // res.json 또는 res.send 없으면 안써도돼
})

router.post('/savemember', function(req, res,next){
  Meeting.findByIdAndUpdate(
    req.body.room._id,
    {
      $set: {
        title:req.body.room.title,
        maxNum:req.body.room.maxNum,
        status:req.body.room.status,
        avgManner:req.body.room.avgManner,
        numOfWoman:req.body.room.numOfWoman,
        numOfMan:req.body.room.numOfMan,
        users:req.body.member
      },
    },
    (err, us) => {}
  );
})

router.post('/getparticipants', function(req,res,next){
  console.log("+++++++++++++++++++++++++++++++++++++")
  console.log("getparticipants!!",req.body)
  console.log("+++++++++++++++++++++++++++++++++++++")
  let arr=[]
  Meeting.find(function(err,meeting){
    meeting.forEach((obj)=>{
      console.log("obj",obj.title)
      if(obj.title===req.body._id){
        console.log(obj.users)
        res.send(obj.users);
      }
    })
  })
});

router.post('/newmemebers',function(req,res,next){
  let isroom = false;
  let perObj = {};
  
  console.log(req.body.groupmember[0])
  console.log(typeof req.body.groupmember)
  Meeting.find(function (err, meeting) {
    //console.log(user)
    meeting.forEach((meet) => {
      if (req.body.title === meet.title) {
        console.log(meet)
        isroom = true;
        perObj = meet;
      }
    });
    if (isroom === true) {
      let arr=[]
     for(let i=0;i<req.body.groupmember.length;i++){
        arr.push(req.body.groupmember[i])
      }

      Meeting.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            users: perObj.users.concat(arr),
            title: perObj.title,
            maxNum: perObj.maxNum,
            status: perObj.status,
            avgManner: ((perObj.avgManner + Number(req.body.avgManner))/2).toFixed(2),
            avgAge: ((perObj.avgAge + req.body.avgAge)/2).toFixed(2),
            numOfWoman: req.body.numOfWoman,
            numOfMan: req.body.numOfMan,
          },
        },
        (err, u) => {
          res.send(perObj);
        }
      );
      //res.send(perObj)
    }
    if (isroom === false) {
      res.send("no");
    }
  });
})

router.post('/leavemember',function(req,res,next){
  console.log("--------------------------")
  console.log(req.body)
  Meeting.find(function (err, meeting) {
    //console.log(user)
    meeting.forEach((meet) => {
      if (req.body.title === meet.title) {
        isroom = true;
        perObj = meet;
      }
    });
    if (isroom === true) {
      //삭제
      if(perObj.numOfWoman+perObj.numOfMan === 1){
        Meeting.deleteOne({_id:perObj._id}).then((result)=>{

          res.send("success");
        })
      }
      else{
        let arr=[]
        for(let i=0;i<perObj.users.length;i++){
          if(perObj.users[i].nickname===req.body.user){
            perObj.users.splice(i, 1);
            i--;
          }
        }
        console.log(perObj.users)
        if(req.body.gender==="woman"){
          perObj.numOfWoman=perObj.numOfWoman-1
        }
        if(req.body.gender==="man"){
          perObj.numOfMan=perObj.numOfMan-1
        }
        Meeting.findByIdAndUpdate(
          perObj._id,
          {
            $set: {
              users: perObj.users,
              title: perObj.title,
              maxNum: perObj.maxNum,
              status: perObj.status,
              avgManner: perObj.avgManner,
              avgAge: perObj.avgAge,
              numOfWoman: perObj.numOfWoman,
              numOfMan: perObj.numOfMan,
            },
          },
          (err, u) => {
            res.send("success");
          }
        );
      }
      
      
      //res.send(perObj)
    }
    if (isroom === false) {
      res.send("no");
    }
  });
})

router.post('/logs', function(req, res, next){
  console.log('Writing logs to cloudwatch');
  res.redirect('back');
})

// PUT edit one meeting
router.put('/:id', async function(req,res,next){
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body);
  //res.json(meeting);
})

// DELETE one meeting
router.post('/end', async function(req,res,next){
  const title = req.body.meetingId;
  const meeting = await Meeting.deleteOne({title : title});
  //res.json(meeting);

  await chime.deleteMeeting({
    MeetingId: meetingCache[title].Meeting.MeetingId
  }).promise();
  res.statusCode = 200;
  res.end();
  // res.send("The meeting is terminated successful");
});



module.exports = router;