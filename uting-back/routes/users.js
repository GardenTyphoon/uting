var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User } = require("../model");
let nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const { exec } = require("child_process");
const crypto = require("crypto");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { rejects } = require("assert");
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

// -- local upload code --
// fs.readdir("uploads", (error) => {
//   // uploads 폴더 없으면 생성
//   if (error) {
//     fs.mkdirSync("uploads");
//   }
// });
// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, "uploads/");
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

let s3 = new AWS.S3();

let upload = multer({
  storage: multerS3({
    s3:s3,
    bucket:"uting-profile-image",
    key: function(req,file,cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
    acl: 'public-read-write'
  })
})

/* GET users listing. */
router.post("/sendEmail", async function (req, res, next) {
  let user_email = req.body.email;
  const code = Math.random().toString(36).substr(2, 11);
  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
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
      res.send("error")
    } else {
      console.log("Email sent: " + info.response);
      res.send(code);
    }
  });
});

router.post("/signup", function (req, res, next) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(req.body.password)
    .digest("base64");
  const user = new User({
    name: req.body.name,
    nickname: req.body.nickname,
    gender: req.body.gender,
    birth: req.body.birth,
    email: req.body.email,
    password: encrypted,
    phone: req.body.phone,
    imgURL: "",
    mannerCredit: 3.5,
    status: false,
    socketid: "",
    ucoin: Number(0),
    beReported: Number(0),
  });

  user.save((err) => {
    res.send("회원가입이 되었습니다.");
  });
});

router.post("/signin", function (req, res, next) {
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
          beReported: perObj.beReported,
        },
      },
      (err, u) => {
        console.log(u);
      }
    );
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
});

router.post("/checknickname", function (req, res, next) {
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.nickname === per.nickname) {
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
      if (req.body.type === "profile") {
        if (req.body.sessionUser === per.email) {
          res.status(200);
          res.send(per);
        }
      }
      if (req.body.type === "myprofile") {
        if (req.body.sessionUser === per.nickname) {
          res.status(201);
          res.send(per);
        }
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
    (err, us) => {
      res.send("success");
    }
  );
});

router.post("/modifyMyProfileImg", upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `${req.file.filename}` });
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
    (err, us) => {
      res.send("Update Ucoin");
    }
  );
});

// 그룹 생성시 온라인 유저인지 확인
router.post("/logined", function (req, res, next) {
  let ismember = false;
  User.find(function (err, user) {
    user.forEach((per) => {
      if (req.body.addMember === per.nickname && per.status === true) {
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
            beReported: perObj.beReported,
          },
        },
        (err, u) => {
          res.send("Success savesocketid");
        }
      );
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
            beReported: perObj.beReported,
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
    }
    if (ismember === false) {
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
            let data = {
              nickname: per.nickname,
              socketid: per.socketid,
            };
            socketidList.push(data);
          }
        });
      });
      res.send(socketidList);
    });
  }
});

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
            ucoin: perObj.ucoin - 1,
            socketid: perObj.socketid,
            beReported: perObj.beReported,
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
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
            mannerCredit: (perObj.mannerCredit + req.body.manner) / 2,
            ucoin: perObj.ucoin,
            socketid: perObj.socketid,
            beReported: perObj.beReported,
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
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
            socketid: perObj.socketid,
            beReported: perObj.beReported + 1,
          },
        },
        (err, u) => {
          res.send("success");
        }
      );
    } else if (ismember === false) {
      res.send("fail");
    }
  });
});
router.post("/changePassword", function (req, res, next) {
  User.find(function (err, user) {
    user.forEach((per) => {
      if (
        per.name === req.body.userinfo.name &&
        per.email === req.body.userinfo.email
      ) {
        if (!per.verify(req.body.userinfo.newPassword)) {
          const encrypted = crypto
            .createHmac("sha1", config.secret)
            .update(req.body.userinfo.newPassword)
            .digest("base64");
          User.findByIdAndUpdate(
            per._id,
            { $set: { password: encrypted } },
            (err, gr) => {}
          );
          res.send("비밀번호가 성공적으로 변경되었습니다.");
        } else {
          res.send(
            "최근 사용한 비밀번호입니다. 다른 비밀번호를 선택해 주세요."
          );
        }
      }
    });
  });
});
module.exports = router;
