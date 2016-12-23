var express = require('express');
var router = express.Router();
var registration = require('./lib/registration');
router.post('/', registration.register);

router.get('/', registration.getRegisteredMembers);
router.get('/:initial', registration.getRegisteredMember);

module.exports = router;