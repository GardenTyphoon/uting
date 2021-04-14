var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { User }=require('../model');
let nodemailer = require('nodemailer'); 
let smtpTransport = require('nodemailer-smtp-transport')

fs.readdir('uploads', (error) => {
  // uploads 폴더 없으면 생성
  if (error) {
      fs.mkdirSync('uploads');
  }
})
const upload = multer({
  storage: multer.diskStorage({
      destination(req, file, cb) {
          cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})
/* GET users listing. */
router.post('/sendEmail',async function(req, res, next) {
  let user_email = req.body.email;
  console.log(req.body);
  const code=Math.random().toString(36).substr(2,11);;
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user:'uting4u@gmail.com',
      pass:'utingforyou'
    }
  }));
  var mailOptions = {
    from:'uting4u@gmail.com',
    to: user_email,
    subject: 'U-TING 회원가입 인증코드',
    text: '안녕하십니까 U-TING입니다. 본인 인증을 위한 코드를 입력 해주시기 바랍니다. 인증코드 ['+code+']'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(code);
    }
  }); 
  
});

router.post('/signup',function(req,res,next){
  
  const user = new User({
    name:req.body.name,
    nickname:req.body.nickname,
    gender:req.body.gender,
    birth:req.body.birth,
    email:req.body.email,
    password:req.body.password,
    phone:req.body.phone,
    imgURL:"",
    mannerCredit: (3.5),
    Umoney:Number(0)
  })

  user.save((err)=>{
    res.send("회원가입이 되었습니다.")
  })

})

router.post('/signin',function(req,res,next){
  let ismember=false;
  User.find(function(err,user){
    user.forEach(per=>{
      console.log(per)
      if(per.email===req.body.email && per.password===req.body.password){
        ismember=true;
        res.send(per);
        
      }
    })
    if(ismember===false){
      res.send("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.");
    }
  })

})
router.post('/viewMyProfile',function(req,res,next){
  console.log(req.body.sessionUser);
  User.find(function(err, user){
    user.forEach(per=>{
      if(req.body.sessionUser === per.email){
        res.send(per);
      }
    })
  })
})

router.post('/modifyMyProfile',function(req,res,next){
  console.log(req.body);
  User.findByIdAndUpdate(req.body._id,{$set:{nickname:req.body.nickname,
  introduce : req.body.introduce, mbti:req.body.mbti, imgURL : req.body.imgURL}},(err,us)=>{
    console.log(req.body._id);
  })
})

router.post('/modifyMyProfileImg', upload.single('img'), (req, res) => {
  res.json({ url : `/uploads/${req.file.filename}`});
})

module.exports = router;