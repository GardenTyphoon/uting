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
      pass:''
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

module.exports = router;
