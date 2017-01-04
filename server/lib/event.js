var express = require('express');
//var passport = require('passport');
var app = express();
var result = {
    status: "OK"
};

var event = {

    getCurrentEvent: function (req, res, next) {
        var obj = require("../data/event.json");
        //res.json(result);
        res.json(obj);
    },
    getEventDetails: function (req, res, next) {
        var obj = require("../data/event.json");
        var currentYear =  new Date().getFullYear();
        var response = "{}";
        //This needs to be modified to get the current year and then filter on that
        if (obj[currentYear]["SP"]["isCurrentEvent"]) {
            response = obj[currentYear]["SP"];
        } else if (obj[currentYear]["DP"]["isCurrentEvent"]) {
            response = obj[currentYear]["DP"];
        } else if (obj[currentYear]["AP"]["isCurrentEvent"]) {
            response = obj[currentYear]["AP"];
        } else if (obj[currentYear]["PB"]["isCurrentEvent"]) {
            response = obj[currentYear]["PB"];
        }
        //res.json(result);
        res.json(response);
    }

};

module.exports = event;