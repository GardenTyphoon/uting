const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../test_app");
const { assert } = require("chai");

describe("McBot API Test", () => {
    // it("Add McBot's conversation content by administrator", function(done){
    //     this.timeout(20000)
    //     let data = {
    //         type: "영화",
    //         content: "About time",
    //     }
    //     chai.request(app)
    //     .post("/mcs")
    //     .send(data)
    //     .end((err, res) => {
    //         assert.equal(res.text, "저장완료")
    //         done();
    //     });
    // });

    it("Get Mcbot's conversation list", function(done){
        this.timeout(20000)
        let data = {
            type: "영화"
        }
        chai.request(app)
        .post("/mcs/list")
        .send(data)
        .end((err, res) => {
            assert.isArray(res.body)
            assert.equal(res.body[0], "About time")
            done();
        })
    })
})