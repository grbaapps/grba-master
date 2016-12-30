var express = require('express');
var router = express.Router();
var registration = require('../registration');
var validator = require('../../validators/registrationValidator');

//validator middleware
router.post('/',validator.validatePost);
router.post('/',registration.register);

router.get('/', registration.getRegisteredMembers);
router.get('/:initial', registration.getRegisteredMember);

module.exports = router;
