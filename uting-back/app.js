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
  console.log("Connected !");
  socket.on('login', function(data) {
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
    console.log(clients)
  });
  socket.on('disconnect',function(){
    console.log('user disconnected');
  });
});
module.exports = app;
