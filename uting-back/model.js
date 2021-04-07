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
    introduce : {
        type:String,
        required:false
    },
})
// User.plugin(autoInc.plugin, 'user');

const Meeting = new Schema({
    title : {
        type:String,
        required:true
    },
    num : {
        type:Number,
        required:true
    },
    status : {
        type:String,
        required:true
    },
})
// Meeting.plugin(autoInc.plugin, 'meeting');

const Group = new Schema({
    name : {
        type:String,
        required:true
    },
})
// Group.plugin(autoInc.plugin, 'group');

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
    Group : mongoose.model('group', Group),
    Ad : mongoose.model('ad', Ad),
    Report : mongoose.model('report', Report)
}