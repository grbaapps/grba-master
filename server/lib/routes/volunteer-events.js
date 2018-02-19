var express = require('express');
var router = express.Router();
var volunteerApi = require('../volunteer-event-api');

//validator middleware

router.get('/year/:year/events/:eventCode',volunteerApi.get);
router.get('/year/:year',volunteerApi.list);

module.exports = router;
