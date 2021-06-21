const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
chai.use(chaiHttp)
const expect = chai.expect;
const app = require("../test_app");
const { assert } = require("chai");

describe("About ads API Test", () => {

    it("Save advertisement", function(done){
        this.timeout(20000)
        let data = {
            type: "banner",
            name: "Test ads",
            email: "gnup@ajou.ac.kr",
            // file: "test",
            contents:"광고를 받아주세요",
            title: "Plz check",
        }
        chai.request(app)
        .post("/ads/save")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "요청완료");
            done();
        });
    });

    it("Upload Advertisement image", function(done){ // mocha chai multer how to ???
        this.timeout(20000)
        let data = {
            test: "test"
        }
        chai.request(app)
        .post("/ads/uploadAdImg")
        .send(data)
        .end((err, res) => {
            done();
        });
    });

    it("Reject advertisement", function(done){
        this.timeout(20000)
        let data = {
            _id: "60c4c17b3679382c9076531c"
        }
        chai.request(app)
        .post("/ads/reject")
        .send(data)
        .end((err, res) => {
            assert.notEqual(res.text, "delete")
            done();
        });
    });

    it("Accept advertisement", function(done){
        this.timeout(20000)
        let data = {
            _id: "60c4c19d0af28a3a20f760e9",
        }
        chai.request(app)
        .post("/ads/accept")
        .send(data)
        .end((err, res) => {
            assert.equal(res.text, "success")
            done();
        });
    });

    it("Get advertisement list", function(done){
        this.timeout(20000)
        chai.request(app)
        .post("/ads/adslist")
        .end((err, res) => {
            expect(res).to.have.status(200)
            done();
        })
    })
})

