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
  });
  //res.json(meetings);
});

// GET one meeting
router.get('/:id', async function(req, res, next) {
  
  const meeting = await Meeting.findOne({_id:req.params.id});
   //res.json(meeting);
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
    numOfMan : req.body.numOfMan
  });
  meeting.save((err)=>{
    res.send("방을 생성하였습니다.")
  });
})

// POST CHIME one meeting
router.post('/join', async function(req, res, next){
  // const temp_title = await Meeting.findOne({title:req.body.title});
  // console.log(temp_title);
  // console.log(req.body);
  // const meeting = new Meeting({
  //   title:req.body.title,
  //   num:req.body.num,
  //   status:req.body.status
  // });
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
  const name = "Tester"; // @TODO 세션을활용해서 Nickname 넣어주기 임시로 이렇게 넣어 놓은 것임.
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
  console.log("getparticipants!!",req.body)
  Meeting.find(function(err,meeting){
    meeting.forEach((obj)=>{
      console.log("obj",obj.title)
      if(obj.title===req.body._id){
        console.log(obj.title)
        res.send(obj.users);
      }
    })
  })
});

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
