var express = require('express');
//var passport = require('passport');  // We don't use security now
var app = express();
var result = {status:"OK"};

var fs = require("fs");

var registration = {
  //initialize: function(url, apiKey, dbName, authCollection) {
    //passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  //},
  register: function(req, res, next) {
      var newData = req.body;
      console.log(data);
      readRegistrationFile(newData);
  },
  getRegisteredMembers: function(req, res, next) {
    res.json(result);
  },
  getRegisteredMember: function(req, res, next) {
    res.json(result);
  }
};
function readRegistrationFile(newData){
  var fileName = '../data/+'newData.year+'_registration.json';
  fs.readFile(fileName, function (err, data) {
      if (err) throw err;
      console.log(data);
      eventsArray = data.events;
      for(i=0 ; i< events.length; i++){
        if(events[i]["name"] == newData.eventName){
          events[i].registrations.push(newData.data);
        }
      }
      //writeToRegistrationFile(eventsArray);
      console.log(eventsArray);

  }

}

function writeToRegistrationFile(){

}

module.exports = registration;
