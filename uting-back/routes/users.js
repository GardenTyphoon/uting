var express = require('express');
var router = express.Router();
const { User }=require('../model');
let nodemailer = require('nodemailer'); 
let smtpTransport = require('nodemailer-smtp-transport')

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
    password:req.body.password
  })

  user.save((err)=>{
    res.send("회원가입이 되었습니다.")
  })

})

router.post('/signin',function(req,res,next){
  console.log("로그인백")
  let check=false;
  User.find(function(err,user){
    user.forEach(per=>{
      console.log(per)
      if(per.email===req.body.email && per.password===req.body.password){
        check=true;
        res.send(per);
        
      }
    })
    if(check===false){
      res.send("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.");
    }
  })

})




module.exports = router;
