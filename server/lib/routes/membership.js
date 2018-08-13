var express = require('express');
var router = express.Router();
var membership = require('../membership');
var validator = require('../../validators/membershipValidator');

//validator middleware
router.post('/',validator.validatePost);
router.post('/',membership.create);

router.post('/emailID/:emailID',validator.validateGet);
router.post('/emailID/:emailID',membership.read);

module.exports = router;
