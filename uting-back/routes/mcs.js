var express = require("express");
const authMiddleware = require("../middlewares/auth");
var router = express.Router();
const { Mc } = require("../model");

router.post("/", authMiddleware, function (req, res, next) {
  const mc = new Mc({
    type: req.body.type,
    content: req.body.content,
  });
  mc.save((err) => {
    res.send("저장완료");
  });
});

router.post("/list", authMiddleware, function (req, res, next) {
  let list = [];
  Mc.find(function (err, mc) {
    mc.forEach((one) => {
      console.log(one)
      if (req.body.type === one.type) {
        list.push(one.content);
      }
    });
    res.send(list);
  });
});

router.post("/delete", authMiddleware, function (req, res, next) {
  let obj = {};
  let exist = false;
  Mc.find(function (err, mc) {
    mc.forEach((one) => {
      if (req.body.type === one.type && req.body.data === one.content) {
        obj = one;
        exist = true;
      }
    });

    if (exist === true) {
      Mc.deleteOne({ _id: obj._id }).then((result, err) => {
        res.send("delete");
      });
    }
    if (exist === false) {
      res.send("fail");
    }
  });
});

module.exports = router;
