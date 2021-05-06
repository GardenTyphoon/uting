var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose=require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meetingsRouter = require('./routes/meetings');
var groupsRouter = require('./routes/groups');
var adsRouter = require('./routes/ads');
var reportsRouter = require('./routes/reports');
var mcsRouter = require('./routes/mcs');

var clients = [];
var members = [];
// PORT => 3001
var app = express();




 mongoose.connect("mongodb://localhost:27017/uting", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
 }).then(()=>console.log("Connect MongoDB"));
 //autoIncrement.initialize(mongoose.connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRouter);
app.use('/users', usersRouter);
app.use('/meetings', meetingsRouter);
app.use('/groups',groupsRouter);
app.use('/ads', adsRouter);
app.use('/reports', reportsRouter);
app.use('/mcs',mcsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.io = require('socket.io')();

app.io.on('connection',function(socket){
  //console.log("Connected !");
  socket.on('login', function(data) {
    
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
    socket.emit("clientid",{"id":clients[clients.length-1].id});
  });
  socket.on('currentSocketId', function(){
    console.log('currentSocketId:' + socket.id);
    let data = socket.id
    app.io.to(socket.id).emit('currentSocketId',data)
  })
  socket.on('message',function(msg){
    let data = "그룹에 초대 되었습니다 ^0^"
    app.io.to(msg.socketid).emit("sendMember",data) // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
  })
  socket.on('premessage',function(msg){
    let data = "그룹에 다른 사용자가 추가되었습니다 ^0^"
    for(let i=0;i<msg.socketidList.length;i++){
      app.io.to(msg.socketidList[i]).emit("premessage",data) // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
    }
   
  })

  socket.on('entermessage',function(msg){

    console.log(msg._id)
    let data = {
      message:"호스트에의해 선택한 미팅방에 입장합니다 ^_^",
      roomid:msg.roomid,
      _id:msg._id
    }
   
    if(msg.socketidList.length!==1){
      for(let i=0;i<msg.socketidList.length;i++){
        app.io.to(msg.socketidList[i]).emit("entermessage",data) // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
      }
    }
  })
  socket.on('joinRoom', function(roomId){
    socket.join('room'); // 'room' 부분 미팅방 방제로 수정 예정
    
  })
  socket.on('startVote', function(data){
    for(let i=0;i<data.socketidList.length;i++){
      console.log(data.socketidList[i])
      app.io.to(data.socketidList[i]).emit("startVote");
    }
    //app.io.in('room').emit("startVote"); //'room'부분 미팅방 방제로 수정 예정
  })

  socket.on('musicplay',function(msg){

    
    console.log("음악!!!!!!!!!!!!!",Object.keys( msg.socketIdList).length)
    let data={
      src:msg.src,
      socketIdList:msg.socketIdList
    }
    console.log("각사용자소켓아이디~!~!~",msg.socketIdList)

    
    if(Object.keys( msg.socketIdList).length>1){
    for(let i=0;i<Object.keys( msg.socketIdList).length;i++){
      app.io.to(msg.socketIdList[i]).emit("musicplay",data) 
      console.log(msg.socketIdList)
    }}

  })

  socket.on('musicpause',function(msg){
    
    if(Object.keys( msg.socketIdList).length>1){
      for(let i=0;i<Object.keys( msg.socketIdList).length;i++){
        app.io.to(msg.socketIdList[i]).emit("musicpause","호스트가 음악을 정지 시켰습니다.") 
      }}
  })

  socket.on('replay',function(msg){
    
    if(Object.keys( msg.socketIdList).length>1){
      for(let i=0;i<Object.keys( msg.socketIdList).length;i++){
        app.io.to(msg.socketIdList[i]).emit("replay","호스트가 음악을 다시 재생 시켰습니다.") 
      }}
  })

  socket.on('makeMeetingRoomMsg',function(data){
    let msg = "그룹 호스트가 미팅방을 생성하였습니다."
    for(let i=0;i<data.groupMembersSocketId.length;i++){
      app.io.to(data.groupMembersSocketId[i]).emit("makeMeetingRoomMsg", msg);
    };
  })
  socket.on('endMeetingAgree',function(data){

    for(let i=0;i<data.socketList.length;i++){
      app.io.to(data.socketList[i]).emit("endMeetingAgree", data.numOfAgree);
    }
  })
  socket.on('endMeetingDisagree',function(data){
    for(let i=0;i<data.socketList.length;i++){
      app.io.to(data.socketList[i]).emit("endMeetingDisagree", data.numOfDisagree);
    }
  }) 
  socket.on('disconnect',function(reason){
    console.log('user disconnected : ' + reason);
  });
});
module.exports = app;
