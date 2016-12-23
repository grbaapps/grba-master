var express = require('express');
//var passport = require('passport');  // We don't use security now
var app = express();
var result = {status:"OK"};

var registration = {
  //initialize: function(url, apiKey, dbName, authCollection) {
    //passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  //},
  register: function(req, res, next) {
      var data = req.body;
      console.log(data);
    res.json(result);
  },
  getRegisteredMembers: function(req, res, next) {
    res.json(result);
  },
  getRegisteredMember: function(req, res, next) {
    res.json(result);
  }
  
};

module.exports = registration;