const { Int32 } = require("bson");
const { Double } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoInc = require('mongoose-auto-increment');

const User = new Schema({
    name : {
        type:String,
        required:true
    },
    nickname : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        required:true
    },
    birth : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    introduce : {
        type:String,
        required:false
    },
    imgURL :{
        type:String,
        required:false
    },
    mannerCredit :{
        type:Number,
        required:true
    },
    Umoney :{
        type:Number,
        required:true
    }
    
})
// User.plugin(autoInc.plugin, 'user');

const Meeting = new Schema({
    title : {
        type:String,
        required:true
    },
    maxNum : {
        type:Number,
        required:true
    },
    status : {
        type:String,
        required:true
    },
    roomImg : {
        type:String,
        required:false
    },
    avgManner : {
        type:Number,
        required:false
    },
    avgAge : {
        type:Number,
        required:false
    },
    users : {
        type:Object,
        required:false
    },
    numOfWoman:{
        type:Number,
        required:false
    },
    numOfMan:{
        type:Number,
        required:false
    }
})
// Meeting.plugin(autoInc.plugin, 'meeting');

const Group = new Schema({
    group_members_id:{
        type:Array,
        required:true
    } 
})
const Ad = new Schema({
    name : {
        type:String,
        required:true
    },
})
// Ad.plugin(autoInc.plugin, 'ad');

const Report = new Schema({
    name : {
        type:String,
        required:true
    },
})
// Report.plugin(autoInc.plugin, 'report');


// autoInc.initialize(mongoose.connection);

module.exports = {
    User : mongoose.model('user', User),
    Meeting : mongoose.model('meeting', Meeting),
    Group : mongoose.model('group',Group),
    Ad : mongoose.model('ad', Ad),
    Report : mongoose.model('report', Report)
}