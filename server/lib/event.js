var express = require('express');
//var passport = require('passport');
var app = express();
var result = {status:"OK"};

var event = {

  getCurrentEvent: function(req, res, next) {
      var obj = require("../data/currentEvent.json");
      //res.json(result);
      res.json(obj);
  },
  getEventDetails: function(req, res, next) {
      var obj = require("../data/proposedEvent.json");
      //res.json(result);
      res.json(obj);
  }    
  
};

module.exports = event;