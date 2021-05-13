var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User } = require("../model");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const { exec } = require("child_process");

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
  console.log(req.body);
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
  const user = new User({
    name: req.body.name,
    nickname: req.body.nickname,
    gender: req.body.gender,
    birth: req.body.birth,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    imgURL: "",
    mannerCredit: 3.5,
    status: false,
    socketid: "",
    ucoin: Number(0),
  });

  user.save((err) => {
    res.send("회원가입이 되었습니다.");
  });
});

router.post("/signin", function (req, res, next) {
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
          },
        },
        (err, u) => {
          res.send(perObj);
        }
      );
      //res.send(per)
    }
    if (ismember === false) {
      res.send("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.");
    }
  });
});

router.post("/checknickname", function (req, res, next) {
  let ismember = false;
  console.log(req.body.nickname);
  User.find(function (err, user) {
    //console.log(user)
    user.forEach((per) => {
      if (req.body.nickname === per.nickname) {
        console.log(per);
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
      if (req.body.sessionUser === per.email) {
        res.send(per);
      }
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
  })
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
    (err, us) => { }
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
    (err, us) => { }
  );
});

// 그룹 생성시 온라인 유저인지 확인
router.post("/logined", function (req, res, next) {

  let ismember = false;
  User.find(function (err, user) {
    //console.log(user)
    user.forEach((per) => {
      if (req.body.addMember === per.nickname && per.status === true) {
        console.log(per);
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
    //console.log(user)
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
            password: perObj.password,
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin,
            socketid: req.body.currentSocketId.id,
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
        console.log("로그아웃", per);
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
            password: perObj.password,
            phone: perObj.phone,
            imgURL: perObj.imgURL,
            mannerCredit: perObj.mannerCredit,
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
          },
        },
        (err, u) => {
          console.log(perObj);
          res.send("success");
        }
      );
    }
    if (ismember === false) {
      console.log("no!");
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
            socketidList.push(per.socketid);
          }
        });
      });
      res.send(socketidList);
    });
  }
});




module.exports = router;
