var express = require("express");
const authMiddleware = require("../middlewares/auth");
var router = express.Router();
const { Group } = require("../model");

router.post("/", function (req, res, next) {
  let exist = false;
  let foundPer;
  let memList = [];

  Group.find(function (err, group) {
    group.forEach((per) => {
      per.member.forEach((mem) => {
        if (req.body.host === mem) {
          exist = true;
          foundPer = per;
        }
      });
    });
    if (exist === true) {
      foundPer.member.push(req.body.memberNickname);
      Group.findByIdAndUpdate(
        foundPer._id,
        { $set: { member: foundPer.member } },
        (err, gr) => {
          res.send(foundPer._id);
        }
      );
    }
    if (exist === false) {
      const group2 = new Group({
        member: [req.body.host, req.body.memberNickname],
      });
      group2.save((err) => {
        res.send("그룹 생성이 완료 되었습니다.");
      });
    }
  });
});

router.post("/getMyGroupMember", function (req, res, next) {
  let isMember = false;
  Group.find(function (err, group) {
    group.forEach((gr) => {
      gr.member.forEach((nickname) => {
        if (req.body.sessionUser === nickname) {
          isMember = true;
          res.send(gr.member);
        }
      });
    });
    if (isMember === false) res.send("no");
  });
});

router.post("/info", function (req, res, next) {
  let ismember = false;
  Group.find(function (err, group) {
    group.forEach((per) => {
      per.member.forEach((mem) => {
        if (req.body.sessionUser === mem) {
          ismember = true;
          res.send(per);
        }
      });
    });
    if (ismember === false) {
      res.send("no");
    }
  });
});

router.post("/leaveGroup", function (req, res, next) {
  let success = false;
  let onlyOnePerson = false;
  Group.find(function (err, group) {
    group.forEach((gr) => {
      gr.member.forEach((mem) => {
        if (req.body.userNickname === mem) {
          console.log(gr._id);
          Group.findByIdAndUpdate(
            gr._id,
            { $pull: { member: { $in: [req.body.userNickname] } } },
            (err) => {}
          );
          success = true;
          onlyOnePerson = true;
        }
      });
      if (gr.member.length === 2 && onlyOnePerson === true) {
        Group.findByIdAndDelete(gr._id, (err) => {});
      }
      onlyOnePerson = false;
    });
    if (success === true) {
      res.send("success");
    } else {
      res.send("fail");
    }
  });
});

router.post("/modifyNickname", function (req, res, next) {
  let exist = false;
  let foundPer;

  Group.find(function (err, group) {
    group.forEach((per) => {
      per.member.forEach((mem) => {
        if (req.body.originNickname === mem) {
          exist = true;
          foundPer = per;
        }
      });
    });
    if (exist === true) {
      for (let i = 0; i < foundPer.member.length; i++) {
        if (foundPer.member[i] === req.body.originNickname) {
          foundPer.member[i] = req.body.reNickname;
        }
      }
      Group.findByIdAndUpdate(
        foundPer._id,
        { $set: { member: foundPer.member } },
        (err, gr) => {
          res.send("success");
        }
      );
    }
    if (exist === false) {
      res.send("fail");
    }
  });
});

module.exports = router;
