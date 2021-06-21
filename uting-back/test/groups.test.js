const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../test_app");
const { assert } = require("chai");

describe("About groups API Test", () => {

    it("Make group!", function(done){
        this.timeout(20000)
        let data = {
            host: "노예",
            memberNickname: "노예1호"
        }
        chai.request(app)
        .post("/groups")
        .send(data)
        .end((err, res) => {
            // assert.equal(res.text, "그룹 생성이 완료 되었습니다.")
            // expect(res).to.have.status(200)
            done();
        });
    });

    it("Get my group member API Test", function(done){
        this.timeout(20000)
        let data = {
            sessionUser: "노예1호"
        }
        chai.request(app)
        .post("/groups/getMyGroupMember")
        .send(data)
        .end((err, res) => {
            // expect(res).to.have.status(200)
            assert.equal(res.body[0], '노예')
            done();
        });
    });

    it("Get my group member info API Test", function(done){ // 위의 API와 코드가 쪼오끔 다름.
        this.timeout(20000)
        let data = {
            sessionUser: "노예1호"
        }
        chai.request(app)
        .post("/groups/info")
        .send(data)
        .end((err, res) => {
            // expect(res).to.have.status(200)
            // assert.equal(res.text, "no")
            assert.equal(res.body.member[0], '노예')
            done();
        });
    });

    // it("Modify user nickname", function(done){
    //     this.timeout(20000)
    //     let data = {
    //         originNickname: "노예",
    //         reNickname: "노예2호"
    //     }
    //     chai.request(app)
    //     .post("/groups/modifyNickname")
    //     .send(data)
    //     .end((err, res) => {
    //         assert.equal(res.text, "success")
    //         // assert.equal(res.text, "fail")
    //         done();
    //     })
    // })

    it("Leave current group", function(done){
        this.timeout(20000)
        let data = {
            userNickname: "노예",
        }
        chai.request(app)
        .post("/groups/leaveGroup")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "success")
            // assert.equal(res.text, "fail")
            done();
        })
    })

})