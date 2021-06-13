const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../app");
const { assert } = require("chai");

// DB의 경우 test 용 mongodb 가 새로 생성됩니다. 회원가입 시 중복 방지가 통합되어있지 않아
// 계속 호출하면 입력이 반복됩니다. 그래서 주석처리해뒀습니다.

describe("USER API TEST", () => {

  before("Database Connect", function(){
    return mongoose.createConnection("mongodb://localhost:27017",{useNewUrlParser: true, useUnifiedTopology: true,})
  });


  describe("/sendEmail API Test", () => {
    it("이메일 인증 코드를 리턴 받는다.", function(done){
      let data = {
        email: "gnup@ajou.ac.kr"
      }
      chai.request(app)
      .post("/users/sendEmail")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      });
    });
  });
  // describe("/signup API Test", () => {
  //   it("회원 가입 완료 메시지를 받는다.", function(done){
  //     this.timeout(20000); // 일반적으로 100xxms 걸림. 테스트를 통과하기 위해서 20000으로 설정하였음.
  //     let data = {
  //       name: "Tester1",
  //       nickname: "Paldal'slave", 
  //       gender: "male",
  //       birth: "19970915",
  //       email: "gnup@ajou.ac.kr",
  //       password: "helpme",
  //       phone: "01086081997",
  //     }
  //     chai.request(app)
  //     .post("/users/signup")
  //     .send(data)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200)
  //       done()
  //     });
  //   });
  // });

  describe("checknickname API Test", () => {
    it("Check Nickname, Response 200 Code", function(done){
      this.timeout(20000)
      let data = {
        nickname: "노예1호"
      }
      chai.request(app)
      .post("/users/checknickname")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "exist")
        done()
      });
    });
  });

  describe("About user Profile API Test", () => {
    it("Get user's profile, Response 200 Code", function(done){
      this.timeout(30000)
      let data = {
        type: "profile",
        sessionUser: "tester1@ajou.ac.kr"
      }
      chai.request(app)
      .post("/users/viewMyProfile")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      });
    });
    it("Get user's my profile, Response 200 Code", function(done){
      this.timeout(20000)
      let data = {
        type: "myprofile",
        sessionUser: "노예1호"
      }
      chai.request(app)
      .post("/users/viewMyProfile")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(201)
        done()
      });
    });

    it("Modify user's profile, Response \"success\"", function(done){
      this.timeout(20000)
      let data = {
        _id: "60c3855602511049e0818570",
        nickname: "노예1호",
        introduce: "안녕하세요 팔달관에서 생활하는 학생입니다.",
        mbit: "ENFP",
      }
      chai.request(app)
      .post("/users/modifyMyProfile")
      .send(data)
      .end((err, res) => {
        expect(res.text).to.equal("success")
        done();
      })
    })

    it("Modify user's profile image, Response json.url", function(done){
      this.timeout(20000)
      let data = {
        filename: "garden_typhoon"
      }
      chai.request(app)
      .post("/users/modifyMyProfileImg")
      .send(data)
      .end((err, res) => {
        done();
      })
    })
  });

  describe("userInfo API Test", () => {
    it("Get users'info, Response user object", function(done){
      this.timeout(20000);
      let data = {
        userId : "노예1호",
      }
      chai.request(app)
      .post("/users/userInfo")
      .send(data)
      .end((err, res) => {
        assert.equal(res.body.nickname, '노예1호');
        done();
      })
    })

    it("Modify users's manner", function(done){
      this.timeout(20000)
      let data = {
        name: "노예",
        manner: "0"
      }
      chai.request(app)
      .post("/users/manner")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "success")
        done();
      });
    });

    it("Change user's password", function(done){
      this.timeout(20000)
      let data = {
        userinfo: {
          name: "Tester1",
          email: "tester1@ajou.ac.kr",
          newPassword: "dddj1i23!@#",
        }
      }
      chai.request(app)
      .post("/users/changePassword")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "최근 사용한 비밀번호입니다. 다른 비밀번호를 선택해 주세요.")
        done();
      })
    })

  })

  describe("userSocketId API Test", () => {
    it("Get usersSocketId, Response users socketId List in Room", function(done){
      this.timeout(20000);
      let data = {
        users : ["노예1호", "노예"]
      }
      chai.request(app)
      .post("/users/usersSocketId")
      .send(data)
      .end((err, res) => {
        assert.equal(res.body[0], "") // Empty state is true
        assert.equal(res.body[1], "Testsocketid1") // Empty state is true
        done();
      })
    })

    it("Get usersSocketIdx, Response users socketId with socketIdx", function(done){
      this.timeout(20000);
      let data = {
        users : ["노예1호", "노예"]
      }
      chai.request(app)
      .post("/users/usersSocketIdx", )
      .send(data)
      .end((err, res) => {
        assert.equal(res.body[1], "0")
        assert.equal(res.body[3], "1")
        done();
      });
    });
    
    it("SocketId save in user database, Reponse user obeject", function(done){
      this.timeout(20000)
      let data = {
        currentUser: "노예",
        currentSocketId : {
          id : "Testsocketid1"
        }
      }
      chai.request(app)
      .post("/users/savesocketid")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "Success savesocketid")
        done();
      });
    });

    it("Get preMemSocketid, Response member's socketId", function(done){
      this.timeout(20000)
      let data = {
        preMember: ["노예", "노예1호"]
      }
      chai.request(app)
      .post("/users/preMemSocketid")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.toString("nickname: '노예1호', socketid: ''")
        done();
      })

    });

  });

  describe("About Ucoin API Test", () => {
    it("Add Ucoin", function(done){
      this.timeout(20000)
      let data = {
        ucoin: "10",
        chargingCoin: "1",
        userId: "60c3855602511049e0818570",
      }
      chai.request(app)
      .post("/users/addUcoin")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "Update Ucoin")
        done();
      });
    });

    it("Cut Ucoin", function(done){
      this.timeout(20000)
      let data = {
        currentUser: "노예",
      }
      chai.request(app)
      .post("/users/cutUcoin")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "success")
        done();
      });
    });
  });

  describe("About log in-out API Test", () => {

    it("Signin(login) API Test, Response 200 Code", function(done){
      this.timeout(20000)
      let data = {
        email: "gnup@ajou.ac.kr",
        password: "1234"
      }
      chai.request(app)
      .post("/users/signin")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      });
    });

    it("Is user logined ?", function(done){
      this.timeout(20000)
      let data = {
        addMember: "노예",
      }
      chai.request(app)
      .post("/users/logined")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "no")
        done();
      });
    });

    it("Logout API Test", function(done){
      this.timeout(20000)
      let data = {
        email: "tester1@ajou.ac.kr",
      }
      chai.request(app)
      .post("/users/logout")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "success") // if fail, return "no"
        done();
      });
    });
  });

  describe("Report other user", () => {
    it("Report other users, Response success", function(done){
      this.timeout(20000)
      let data = {
        nickname: "노예1호"
      }
      chai.request(app)
      .post("/users/report")
      .send(data)
      .end((err, res) => {
        assert.equal(res.text, "success")
        assert.notEqual(res.text, "fail")
        done();
      })
    })
  })

});
