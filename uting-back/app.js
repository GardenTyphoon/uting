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
    console.log('user login');
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
    console.log(clients)
    console.log(clients[clients.length-1].id)
    socket.emit("clientid",{"id":clients[clients.length-1].id});
  });

  socket.on('message',function(msg){
    //console.log("alarm")
    socket.emit("message",{"id":msg.socketid});
    console.log("message",msg.socketid)
    let data = "그룹에 초대 되었습니다 ^0^"
    app.io.to(msg.socketid).emit("sendMember",data)
    //socket.emit('sendMember', { id:msg.socketid, msg:data });
    //socket.emit("sendMember",{message:data});
    console.log("***************")
    console.log(msg.socketid,data)
    console.log("***************")
  })

  
    //socket.emit("clientid",{"id":clients[clients.length-1].id});


  // socket.on('message', (msg) => {
  //   console.log("message 백!")
  //   msg='그룹이 생성 될 예정입니다.';
  //   app.io.emit('message', msg);
  // });

  // socket.on('message', function(data) {
  //   // 클라이언트 소켓 아이디를 통해서 그 소켓을 가진 클라이언트에만 메세지를 전송
  //   console.log("-------------")
  //   console.log(clients)
  //   console.log("-------------")

  //   console.log("**************")
  //   console.log(data)
  //   console.log("**************")

  //   for (var i=0; i < clients.length; i++) {
  //       var client = clients[i];
  //       console.log('client.uid = '+ client.newuid);
  //       if (client.newuid == data.uid) {
  //         //app.io.socket(client.newuid).send(data.msg);
  //         console.log("미리아이디",client.newuid)
  //         break;
  //       }
  //     }
  //   });

  socket.on('disconnect',function(){
    console.log('user disconnected');
  });
});
module.exports = app;
