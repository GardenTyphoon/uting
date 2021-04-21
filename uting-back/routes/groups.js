var express = require('express');
var router = express.Router();
const { Group } = require('../model');

router.post('/', function (req, res, next) {
    console.log(req.body.groupId);
    Group.find(function (err, group) {
        group.forEach(gr => {
            if (req.body._id === gr._id) {
                console.log(gr);
                res.send(gr);
            }
        })
    })
})
module.exports = router;