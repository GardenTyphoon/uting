var express = require('express');
var router = express.Router();
const { Group } = require('../model');

router.post('/getMyGroup', function (req, res, next) {
    Group.find(function (err, group) {
        group.forEach(gr => {
           
            if (req.body.groupId === gr._id.toString()) {
               
                res.send(gr.group_members_id);
            }
        })
    })
})
module.exports = router;