const { Int32 } = require("bson");
const { Double } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const config = require("./config");

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birth: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  introduce: {
    type: String,
    required: false,
  },
  imgURL: {
    type: String,
    required: false,
  },
  mannerCredit: {
    type: Number,
    required: true,
  },
  ucoin: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    requried: true,
  },
  socketid: {
    type: String,
    requried: false,
  },
  beReported: {
    type: Number,
    required: false,
  },
  refresh_token: {
    type: String,
    required: false,
  },
});
// User.plugin(autoInc.plugin, 'user');

User.methods.verify = function (password) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");
  console.log(this.password === encrypted);

  return this.password === encrypted;
};
User.statics.findOneByEmail = function (email) {
  return this.findOne({
    email,
  }).exec();
};

const Meeting = new Schema({
  title: {
    type: String,
    required: true,
  },
  maxNum: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  roomImg: {
    type: String,
    required: false,
  },
  avgManner: {
    type: Number,
    required: false,
  },
  avgAge: {
    type: Number,
    required: false,
  },
  users: {
    type: Array,
    required: false,
  },
  numOfWoman: {
    type: Number,
    required: false,
  },
  numOfMan: {
    type: Number,
    required: false,
  },
  // sumManner:{
  //     type:Number,
  //     required:false
  // },
  // sumAge:{
  //     type:Number,
  //     required:false
  // }
});
// Meeting.plugin(autoInc.plugin, 'meeting');

const Group = new Schema({
  member: {
    type: Array,
    required: true,
  },
});
const Ad = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
// Ad.plugin(autoInc.plugin, 'ad');

const Report = new Schema({
  target: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
});
// Report.plugin(autoInc.plugin, 'report');

const Mc = new Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// autoInc.initialize(mongoose.connection);

module.exports = {
  User: mongoose.model("user", User),
  Meeting: mongoose.model("meeting", Meeting),
  Group: mongoose.model("group", Group),
  Ad: mongoose.model("ad", Ad),
  Report: mongoose.model("report", Report),
  Mc: mongoose.model("mc", Mc),
};
