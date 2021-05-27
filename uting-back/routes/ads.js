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
  console.log(req.body)
  const ad = new Ad({
    type:req.body.type,
    name:req.body.name,
    email:req.body.email,
    file:req.body.file,
    contents:req.body.contents,
  });

  ad.save((err) => {
    res.send("요청완료");
  });

})

router.post("/uploadAdImg", upload.single("img"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.get('/',function(req,res,next){
  Ad.find({}).then((ad)=>{ 
    res.json(ad);
  }).catch((err) => {
    res.send(err);
  });
})

module.exports = router;
