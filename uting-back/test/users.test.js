const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const { User } = require("../model");
const app = require("../app");

describe("USER API TEST", () => {

  // before("Database Connect", function(){
  //   return mongoose.createConnection("mongodb://localhost:27017",{useNewUrlParser: true, useUnifiedTopology: true,})
  // });


  // describe("/sendEmail API Test", () => {
  //   it("이메일 인증 코드를 리턴 받는다.", function(done){
  //     let data = {
  //       email: "gnup@ajou.ac.kr"
  //     }
  //     chai.request(app)
  //     .post("/users/sendEmail")
  //     .send(data)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200)
  //       done()
  //     });
  //   });
  // });
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

  describe("signin API Test", () => {
    it("Success Login, Response 200 Code", function(done){
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
  });

  describe("checknickname API Test", () => {
    it("Check Nickname, Response 200 Code", function(done){
      this.timeout(20000)
      let data = {
        nickname: "아미타이거"
      }
      chai.request(app)
      .post("/users/checknickname")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      });
    });
  });

  describe("viewMyProfile API Test", () => {
    it("Get user's profile, Response 200 Code", function(done){
      this.timeout(30000)
      let data = {
        type: "profile",
        sessionUser: "gnup@ajou.ac.kr"
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
        sessionUser: "Paldal'slave"
      }
      chai.request(app)
      .post("/users/viewMyProfile")
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(201)
        done()
      });
    });
  });
});
