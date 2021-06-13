const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../app");
const { assert } = require("chai");

describe("Meeting API Test", () => {
    it("Get meeting list", function(done){
        this.timeout(20000)
        chai.request(app)
        .post("/meetings")
        .end((err, res) => {
            assert.isArray(res.body)
            done();
        });
    });

    // it("Get attendeeinfo for chime sdk", function(done){ // if meeting cache empty, stall
    //     this.timeout(20000)
    //     let data = {
    //         meetingId: "테스트",
    //         attendee: "노예"
    //     }
    //     chai.request(app)
    //     .post("/meetings/attendee")
    //     .send(data)
    //     .end((err, res) => {
    //         // assert.isString(res.body)
    //         done();
    //     });
    // });

    it("Create meeting by chime API", function(done){
        this.timeout(20000)
        let data = {
            flag: 0,
            title: "연구실",
            maxNum: 2,
            status: "대기",
            avgManner: 2.5,
            avgAge: 25,
            users: ["노예", "노예1호"],
            numOfWoman: 1,
            numOfMan: 1,
            session: "노예",
            groupmember: ["노예" , "노예1호"]
        }
        chai.request(app)
        .post("/meetings/create")
        .send(data)
        .end((err, res) => {
            expect(res).to.have.status(200)
            done();
        });
    });

    it("Save member in room", function(done){
        this.timeout(20000)
        let data = {
            room: {
                _id: "60c58c072267df01e02067f8",
                title: "연구실",
                maxNum: 2,
                status: "대기",
                avgManner: 2.5,
                numOfWoman: 1,  
                numOfMan: 1,
            },            
            member: ["노예", "노예1호"],
        }
        chai.request(app)
        .post("/meetings/savemember")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "Success savemember");
            done();
        });
    });

    it("Get participants list", function(done){
        this.timeout(20000)
        let data = {
            _id: "연구실"
        }
        chai.request(app)
        .post("/meetings/getparticipants")
        .send(data)
        .end((err, res) => {
            assert.equal(res.body.users[0], "노예")
            done();
        });
    });

    it("Does the romm exist?", function(done){
        this.timeout(20000)
        let data = {
            title: {title: "연구실"}
        }
        chai.request(app)
        .post("/meetings/check")
        .send(data)
        .end((err, res) => {
            // expect(res).to.have.status(200)
            assert.equal(res.text, "true");
            done();
        });
    });

    it("Leave the room", function(done){
        this.timeout(20000)
        let data = {
            title: "연구실",
            user: "노예1호",
            gender: "man"
        }
        chai.request(app)
        .post("/meetings/leavemember")
        .send(data)
        .end((err, res) => {
            // assert.equal(res.text, "last")// "no" , "last"
            done();
        });
    });

    it("Chime API error logs", function(done){
        this.timeout(20000)
        chai.request(app)
        .post("/meetings/logs")
        .end((err, res) => {
            expect(res).to.have.status(200)
            done()
        });
    });

    // it("Delete meeting data in server's local cache and CHIME server", function(done){
    //     this.timeout(20000)
    //     let data = {
    //         title: "연구실"
    //     }
    //     chai.request(app)
    //     .post("/meetings/end")
    //     .send(data)
    //     .end((err, res) => {
    //         expect(res).to.have.status(200)
    //         done();
    //     });
    // });
})