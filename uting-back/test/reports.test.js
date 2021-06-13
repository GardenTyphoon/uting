const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../app");
const { assert } = require("chai");


describe("About report API Test", () =>{
    it("Get report list to administrator", function(done){
        chai.request(app)
        .get("/reports")
        .end((err, res) => {
            done();
        });
    });

    it("Save report in database", function(done){
        this.timeout(20000)
        let data = {
            reportTarget: "노예1호",
            reportContent: "패드립",
            reportRequester: "노예"
        }
        chai.request(app)
        .post("/reports/saveReport")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "신고가 정상적으로 접수되었습니다.");
            done();
        });
    });

    it("Delete report", function(done){
        this.timeout(20000)
        let data = {
            _id: ""
        }      
        chai.request(app)
        .post("/reports/delete")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "success")
            done();
        })
    })
})