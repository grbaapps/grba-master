var express = require('express');
var router = express.Router();
var membership = require('../membership');
var validator = require('../../validators/membershipValidator');

//validator middleware
router.post('/',validator.validatePost);
router.post('/',membership.create);

router.get('/:emailID',validator.validateGet);
router.get('/:emailID',membership.read);
router.get('/',validator.validateGet);
router.get('/',membership.read);


module.exports = router;
