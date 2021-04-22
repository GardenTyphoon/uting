var express = require('express');
var router = express.Router();
const { Group } = require('../model');

router.post('/getMyGroup', function (req, res, next) {
    Group.find(function (err, group) {
        group.forEach(gr => {
            console.log(gr);
            console.log(gr._id);
            console.log(gr.group_members_id);
            if (req.body.groupId === gr._id.toString()) {
                console.log("hihi");
                res.send(gr.group_members_id);
            }
        })
    })
})
module.exports = router;