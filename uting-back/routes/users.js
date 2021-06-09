var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User } = require("../model");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const { exec } = require("child_process");
<<<<<<< HEAD
const crypto = require("crypto");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { rejects } = require("assert");
=======
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1

fs.readdir("uploads", (error) => {
  // uploads 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("uploads");
  }
});
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
/* GET users listing. */
router.post("/sendEmail", async function (req, res, next) {
  let user_email = req.body.email;
<<<<<<< HEAD
=======
  console.log(req.body);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
  const code = Math.random().toString(36).substr(2, 11);
  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "uting4u@gmail.com",
        pass: "uting0515!",
      },
    })
  );
  var mailOptions = {
    from: "uting4u@gmail.com",
    to: user_email,
    subject: "U-TING 회원가입 인증코드",
    text:
      "안녕하십니까 U-TING입니다. 본인 인증을 위한 코드를 입력 해주시기 바랍니다. 인증코드 [" +
      code +
      "]",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send(code);
    }
  });
});

router.post("/signup", function (req, res, next) {
<<<<<<< HEAD
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(req.body.password)
    .digest("base64");
=======
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
  const user = new User({
    name: req.body.name,
    nickname: req.body.nickname,
    gender: req.body.gender,
    birth: req.body.birth,
    email: req.body.email,
<<<<<<< HEAD
    password: encrypted,
=======
    password: req.body.password,
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
    phone: req.body.phone,
    imgURL: "",
    mannerCredit: 3.5,
    status: false,
    socketid: "",
    ucoin: Number(0),
<<<<<<< HEAD
    beReported: Number(0),
=======
    beReported:Number(0),
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
  });

  user.save((err) => {
    res.send("회원가입이 되었습니다.");
  });
});

router.post("/signin", function (req, res, next) {
<<<<<<< HEAD
  const { email, password } = req.body;
  const secret = req.app.get("jwt-secret");
  let perObj = {};

  const check = (user) => {
    if (!user) {
      // user does not exist
      throw new Error("login failed");
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        if (user.beReported >= 3) {
          res.send("hell");
        } else {
          perObj = user;
          // create a promise that generates jwt asynchronously
          const p = new Promise((resolve, reject) => {
            jwt.sign(
              {
                _id: user._id,
                name: user.name,
                nickname: user.nickname,
                gender: user.gender,
                birth: user.birth,
                email: user.email,
                phone: user.phone,
                imgURL: user.imgURL,
                mannerCredit: user.mannerCredit,
                socketid: user.socketid,
                ucoin: user.ucoin,
                beReported: user.beReported,
              },
              secret,
              {
                expiresIn: "3h", //s , h ,d sec, hour, day
                issuer: "uting.com",
                subject: "userInfo",
              },
              (err, token) => {
                if (err) {
                  console.log(err);
                  reject(err);
                }
                resolve(token);
              }
            );
          });
          return p;
        }
      } else {
        throw new Error("login failed");
      }
    }
  };

  const respond = (token) => {
    console.log(token);
    res.json({
      message: "logged in successfully",
      token,
      perObj,
    });
  };

  const onError = (error) => {
    res.status(200).json({
      message: error.message,
    });
  };
  User.findOneByEmail(email).then(check).then(respond).catch(onError);
=======
  let ismember = false;
  let perObj = {};

  User.find(function (err, user) {
    user.forEach((per) => {
      if (per.email === req.body.email && per.password === req.body.password) {
        ismember = true;
        perObj = per;
      }
    });
    if (ismember === true) {
      console.log(perObj._id);
      if(perObj.beReported>=3){
        res.send("hell")
      }
      else{
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: true,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
            password: perObj.password,
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            socketid: perObj.socketid,
            ucoin: perObj.ucoin,
            beReported:perObj.beReported
          },
        },
        (err, u) => {
          res.send(perObj);
        }
      );
      }
      //res.send(per)
    }
    if (ismember === false) {
      res.send("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.");
    }
  });
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
});

router.post("/checknickname", function (req, res, next) {
  let ismember = false;
<<<<<<< HEAD
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.nickname === per.nickname) {
=======
  console.log(req.body.nickname);
  User.find(function (err, user) {
    //console.log(user)
    user.forEach((per) => {
      if (req.body.nickname === per.nickname) {
        console.log(per);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
        ismember = true;
        res.send("exist");
      }
    });
    if (ismember === false) {
      res.send("no");
    }
  });
});

router.post("/viewMyProfile", function (req, res, next) {
  User.find(function (err, user) {
    user.forEach((per) => {
<<<<<<< HEAD
      if (req.body.sessionUser === per.email) {
        res.send(per);
      }
=======
      if(req.body.type==="profile"){
        if (req.body.sessionUser === per.email) {
          res.send(per);
        }
      }
      if(req.body.type==="myprofile"){
        if (req.body.sessionUser === per.nickname) {
          res.send(per);
        }
      }
      
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
    });
  });
});
router.post("/userInfo", function (req, res, next) {
  User.find(function (err, user) {
    user.forEach((per) => {
      if (
        req.body.userId === per._id.toString() ||
        req.body.userId === per.nickname
      ) {
        res.send(per);
      }
    });
  });
});

router.post("/usersSocketId", function (req, res, next) {
  let data = [];
  User.find(function (err, user) {
    user.forEach((per) => {
      req.body.users.forEach((one) => {
        if (one === per._id.toString() || one === per.nickname) {
          data.push(per.socketid);
        }
      });
    });
    res.send(data);
  });
});
router.post("/usersSocketIdx", function (req, res, next) {
  let data = [];
  User.find(function (err, user) {
    user.forEach((per, idx) => {
      req.body.users.forEach((one) => {
        if (one === per._id.toString() || one === per.nickname) {
          data.push(per.socketid);
          data.push(idx);
        }
      });
    });
    res.send(data);
  });
});
router.post("/modifyMyProfile", function (req, res, next) {
  User.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        nickname: req.body.nickname,
        introduce: req.body.introduce,
        mbti: req.body.mbti,
        imgURL: req.body.imgURL,
      },
    },
<<<<<<< HEAD
    (err, us) => {}
=======
    (err, us) => {
      res.send("success")
    }
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
  );
});

router.post("/modifyMyProfileImg", upload.single("img"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post("/addUcoin", function (req, res, next) {
  let newUcoin = req.body.ucoin + req.body.chargingCoin;

  User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: {
        ucoin: newUcoin,
      },
    },
    (err, us) => {}
  );
});

// 그룹 생성시 온라인 유저인지 확인
router.post("/logined", function (req, res, next) {
  let ismember = false;
  User.find(function (err, user) {
<<<<<<< HEAD
    user.forEach((per) => {
      if (req.body.addMember === per.nickname && per.status === true) {
=======
    //console.log(user)
    user.forEach((per) => {
      if (req.body.addMember === per.nickname && per.status === true) {
        console.log(per);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
        ismember = true;
        res.send(per);
      }
    });
    if (ismember === false) {
      res.send("no");
    }
  });
});

//소켓아이디저장
router.post("/savesocketid", function (req, res, next) {
  let ismember = false;
  let perObj = {};
  User.find(function (err, user) {
<<<<<<< HEAD
=======
    //console.log(user)
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
    user.forEach((per) => {
      if (req.body.currentUser === per.nickname) {
        ismember = true;
        perObj = per;
      }
    });
    if (ismember === true) {
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: perObj.status,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
<<<<<<< HEAD
=======
            password: perObj.password,
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin,
            socketid: req.body.currentSocketId.id,
<<<<<<< HEAD
            beReported: perObj.beReported,
=======
            beReported:perObj.beReported
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
          },
        },
        (err, u) => {
          res.send(perObj);
        }
      );
      //res.send(perObj)
    }
    if (ismember === false) {
      res.send("no");
    }
  });
});

router.post("/logout", function (req, res, next) {
  let ismember = false;
  let perObj = {};
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.email === per.email) {
        ismember = true;
        perObj = per;
<<<<<<< HEAD
=======
        console.log("로그아웃", per);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      }
    });
    if (ismember === true) {
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: false,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
<<<<<<< HEAD
=======
            password: perObj.password,
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
<<<<<<< HEAD
            beReported: perObj.beReported,
          },
        },
        (err, u) => {
=======
            beReported:perObj.beReported
          },
        },
        (err, u) => {
          console.log(perObj);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
          res.send("success");
        }
      );
    }
    if (ismember === false) {
<<<<<<< HEAD
=======
      console.log("no!");
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      res.send("no");
    }
  });
});

router.post("/preMemSocketid", function (req, res, next) {
  let socketidList = [];
  if (req.body.preMember === undefined) {
    res.send("undefined");
  } else {
    User.find(function (err, user) {
      user.forEach((per) => {
        req.body.preMember.forEach((mem) => {
          if (mem === per.nickname) {
<<<<<<< HEAD
            socketidList.push(per.socketid);
          }
        });
      });
=======
            console.log(mem + " : " + per.socketid);
            let data={
              nickname:per.nickname,
              socketid:per.socketid
            }
            socketidList.push(data);
          }
        });
      });
      console.log("socketidList : " + socketidList);
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      res.send(socketidList);
    });
  }
});

<<<<<<< HEAD
router.post("/cutUcoin", function (req, res, next) {
  let perObj = {};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.currentUser === per.nickname) {
        ismember = true;
        perObj = per;
      }
    });
    if (ismember === true) {
=======
router.post("/cutUcoin",function(req,res,next){
  let perObj={};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
        if (req.body.currentUser === per.nickname) {
          ismember = true;
          console.log("-----------------")
          perObj=per;
          //perArr.push(per)
          console.log("-----------------")
        }
    
    });
    if(ismember===true){

>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: perObj.status,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
<<<<<<< HEAD
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin - 1,
            socketid: perObj.socketid,
            beReported: perObj.beReported,
=======
            password: perObj.password,
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin-1,
            socketid: perObj.socketid,
            beReported:perObj.beReported
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
<<<<<<< HEAD
    }
  });
});

router.post("/manner", function (req, res, next) {
  let perObj = {};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.name === per.nickname) {
        ismember = true;
        perObj = per;
      }
    });
    if (ismember === true) {
=======

    }
    
  });
})

router.post("/manner",function(req,res,next){
  let perObj={};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
        if (req.body.name === per.nickname) {
          ismember = true;
          perObj=per;
        }
    
    });
    if(ismember===true){
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: perObj.status,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
<<<<<<< HEAD
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: (perObj.mannerCredit + req.body.manner) / 2,
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
            beReported: perObj.beReported,
=======
            password: perObj.password,
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: ((perObj.mannerCredit + req.body.manner)/2),
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
            beReported:perObj.beReported
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
<<<<<<< HEAD
    }
  });
});

router.post("/report", function (req, res, next) {
  let perObj = {};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.nickname === per.nickname) {
        ismember = true;
        perObj = per;
      }
    });
    if (ismember === true) {
=======

    }
    
  });
})

router.post('/report',function(req,res,next){
  console.log(req.body.nickname)
  let perObj={};
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
        if (req.body.nickname === per.nickname) {
          ismember = true;
          perObj=per;
        }
    
    });
    if(ismember===true){
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
      User.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: perObj.status,
            _id: perObj._id,
            name: perObj.name,
            nickname: perObj.nickname,
            gender: perObj.gender,
            birth: perObj.birth,
            email: perObj.email,
<<<<<<< HEAD

=======
            password: perObj.password,
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
<<<<<<< HEAD
            beReported: perObj.beReported + 1,
=======
            beReported:perObj.beReported+1
>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
<<<<<<< HEAD
    }
  });
});
=======

    }
    else if(ismember===false){
      res.send("fail")
    }
    
  });
})



>>>>>>> 018918c77b3fdc162d52b255aa22743d7a2db0c1

module.exports = router;
