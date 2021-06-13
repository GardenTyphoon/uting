var express = require('express');
var router = express.Router();
const { Ad }=require('../model');
const fs = require("fs");
const multer = require("multer");
const path = require("path");
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

router.post('/save', function(req,res,next){
  const ad = new Ad({
    type:req.body.type,
    name:req.body.name,
    email:req.body.email,
    file:req.body.file,
    contents:req.body.contents,
    title:req.body.title,
    status:"false",
  });

  ad.save((err) => {
    res.send("요청완료");
  });

})

router.post("/uploadAdImg", upload.single("img"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/reject', function(req,res,next){
  Ad.deleteOne({_id:req.body._id}).then((result, err)=>{
    if(result.n != 0) res.send("delete")
    else res.send("fail to delete")
  })

})

router.post('/accept', function(req,res,next){
  let ismember = false;
  let perObj = {};
  Ad.find(function (err, ads) {
    ads.forEach((ad) => {
      if (ad._id.toString() === req.body._id) {
        ismember = true;
        perObj = ad;
      }
    });
    if (ismember === true) {
      Ad.findByIdAndUpdate(
        perObj._id,
        {
          $set: {
            status: "true",
            _id: perObj._id,
            name: perObj.name,
            email: perObj.email,
            file: perObj.file,
            contents: perObj.contents,
            title: perObj.title
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

})

router.post('/adslist', function(req, res, next) {
  Ad.find({}).then((ads)=>{
    res.send(ads);
  }).catch((err) => {
    res.send(err);
  });
});

module.exports = router;
