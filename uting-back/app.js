var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
var usersRouter = require("./routes/users");
var meetingsRouter = require("./routes/meetings");
var groupsRouter = require("./routes/groups");
var authMiddleware = require("./middlewares/auth");
var adsRouter = require("./routes/ads");
var reportsRouter = require("./routes/reports");
var mcsRouter = require("./routes/mcs");

var config = require("./config");
var clients = [];
var members = [];
// PORT => 3001
var app = express();

mongoose
  .connect("mongodb://mongo/uting", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connect MongoDB"));
/*
mongoose
  .connect("mongodb://localhost:27017/uting", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connect MongoDB"));
*/
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// set jwt secret hash
app.set("jwt-secret", config.secret);

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", usersRouter);
app.use("/meetings", meetingsRouter);
app.use("/groups", groupsRouter);
app.use("/ads", adsRouter);
app.use("/reports", reportsRouter);
app.use("/mcs", mcsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.io = require("socket.io")();

app.io.on("connection", function (socket) {
  socket.on("login", function (data) {
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
    socket.emit("clientid", { id: clients[clients.length - 1].id });
  });
  socket.on("currentSocketId", function () {
    let data = socket.id;
    app.io.to(socket.id).emit("currentSocketId", data);
  });

  socket.on("message", function (msg) {
    let data = {
      type: "sendMember",
      message: "그룹에 초대 되었습니다 ^0^",
    };
    app.io.to(msg.socketid).emit("main", data); // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
  });
  socket.on("premessage", function (msg) {
    let data = {
      type: "premessage",
      message: "그룹에 다른 사용자가 추가되었습니다 ^0^",
    };
    for (let i = 0; i < msg.socketidList.length; i++) {
      app.io.to(msg.socketidList[i]).emit("main", data); // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
    }
  });

  socket.on("message", function (msg) {
    let data = "그룹에 초대 되었습니다 ^0^";
    app.io.to(msg.socketid).emit("sendMember", data); // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
  });
  socket.on("premessage", function (msg) {
    let data = "그룹에 다른 사용자가 추가되었습니다 ^0^";
    for (let i = 0; i < msg.socketidList.length; i++) {
      app.io.to(msg.socketidList[i]).emit("premessage", data); // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
    }
  });

  socket.on("entermessage", function (msg) {
    let data = {
      type: "entermessage",
      message: "호스트에의해 선택한 미팅방에 입장합니다 ^_^",
      roomid: msg.roomid,
      _id: msg._id,
    };

    if (Object.keys(msg.socketidList.length) !== 1) {
      for (let i = 0; i < Object.keys(msg.socketidList).length; i++) {
        app.io.to(msg.socketidList[i]).emit("main", data); // 진짜 msg.socketid 를 가진 사용자에게 message를 보내는것.
      }
    }
  });
  socket.on("makeMeetingRoomMsg", function (msg) {
    let data = {
      type: "makeMeetingRoomMsg",
      roomtitle: msg.roomtitle,
    };
    for (let i = 0; i < msg.groupMembersSocketId.length; i++) {
      app.io.to(msg.groupMembersSocketId[i]).emit("main", data);
    }
  });

  socket.on("currentSocketId", function () {
    let data = socket.id;
    app.io.to(socket.id).emit("currentSocketId", data);
  });

  socket.on("golove", function (lovemessage) {
    let data = {
      type: "golove",
      sender: lovemessage.lovemessage.sender,
      message: lovemessage.lovemessage.message,
    };
    console.log(data);
    app.io.to(lovemessage.lovemessage.socketid).emit("room", data);
  });

  socket.on("joinRoom", function (roomId) {
    socket.join("room"); // 'room' 부분 미팅방 방제로 수정 예정
  });
  socket.on("startVote", function (msg) {
    let data = {
      type: "startVote",
    };
    for (let i = 0; i < Object.keys(msg.socketidList).length; i++) {
      app.io.to(msg.socketidList[i]).emit("room", data);
    }
  });

  socket.on("musicplay", function (msg) {
    let data = {
      type: "musicplay",
      src: msg.src,
      socketIdList: msg.socketIdList,
    };
    if (Object.keys(msg.socketIdList).length > 1) {
      for (let i = 0; i < Object.keys(msg.socketIdList).length; i++) {
        app.io.to(msg.socketIdList[i]).emit("room", data);
      }
    }
  });

  socket.on("musicpause", function (msg) {
    let data = {
      type: "musicpause",
      message: "호스트가 음악을 정지 시켰습니다.",
    };
    if (Object.keys(msg.socketIdList).length > 1) {
      for (let i = 0; i < Object.keys(msg.socketIdList).length; i++) {
        app.io.to(msg.socketIdList[i]).emit("room", data);
      }
    }
  });

  socket.on("replay", function (msg) {
    let data = {
      type: "replay",
      message: "호스트가 음악을 다시 재생 시켰습니다.",
    };
    if (Object.keys(msg.socketIdList).length > 1) {
      for (let i = 0; i < Object.keys(msg.socketIdList).length; i++) {
        app.io.to(msg.socketIdList[i]).emit("room", data);
      }
    }
  });

  socket.on("endMeetingAgree", function (msg) {
    let data = {
      type: "endMeetingAgree",
      numOfAgree: msg.numOfAgree,
    };
    for (let i = 0; i < Object.keys(msg.participantsSocketIdList).length; i++) {
      app.io.to(msg.participantsSocketIdList[i]).emit("room", data);
    }
  });

  socket.on("endMeetingDisagree", function (msg) {
    let data = {
      type: "endMeetingDisagree",
      numOfDisagree: msg.numOfDisagree,
    };
    for (let i = 0; i < Object.keys(msg.participantsSocketIdList).length; i++) {
      app.io.to(msg.participantsSocketIdList[i]).emit("room", data);
    }
  });

  socket.on("midleave", function (msg) {
    let data = {
      type: "midleave",
      midleaveUser: msg.midleaveUser,
    };
    for (let i = 0; i < Object.keys(msg.memlist).length; i++) {
      app.io.to(msg.memlist[i].socketid).emit("room", data);
    }
  });

  socket.on("notifyTurn", function (msg) {
    let data = {
      type: "notifyTurn",
      turn: msg.turn,
      remainParticipants: msg.remainParticipants,
    };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });
  socket.on("sendMsg", function (msg) {
    let data = { type: "receiveMsg", mesg: msg.msg, user: msg.user };
    app.io.to(msg.turnSocketId).emit("room", data);
  });
  socket.on("sendQues", function (msg) {
    let data = { type: "receiveQues", mesg: msg.msg, user: msg.user };
    app.io.to(msg.turnSocketId).emit("room", data);
  });
  socket.on("respondMsg", function (msg) {
    let data = { type: "receiveMsg", mesg: msg.msg, user: msg.user };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });

  socket.on("gameStart", function (msg) {
    let data = {
      type: "gameStart",
      message: `호스트에의해 ${msg.gameName}이 시작합니다 ^_^`,
      gameNum: msg.gameNum,
    };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });

  socket.on("endGame", function (msg) {
    let data = {
      type: "endGame",
      message: `게임이 종료 되었습니다!~!`,
    };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });

  socket.on("notifyRole", function (msg) {
    let data = {
      type: "notifyRole",
      message: `역할이 정해졌습니다. 카드를 확인해 보세요!~!`,
      role: msg.role,
    };

    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });

  socket.on("newParticipants", function (msg) {
    let data = {
      type: "newParticipants",
    };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("room", data);
    }
  });
  socket.on("leaveGroup", function (msg) {
    let data = {
      type: "someoneLeaveGroup",
      message: msg.leavingUsers + "님이 그룹을 나갔습니다.",
    };
    for (let i = 0; i < msg.socketIdList.length; i++) {
      app.io.to(msg.socketIdList[i]).emit("main", data);
    }
  });
});

module.exports = app;
