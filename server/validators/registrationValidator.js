var validator = require('validate.js')
var logger = require('../lib/logModule');
var eventObj = require("../data/currentEvent.json");
exports.validatePost = function(req,res,next){
  var inputData = req.body;
  var config = req.globalConfig;
  logger.debug("Inside validator : \n"+JSON.stringify(config))
  var phoneNoPattern = /\(\d{3}\)-\d{3}-\d{4}/;
  var validationRules = {
    "code":{
      presence: {
        message: "^Event code is a mandatory field"
      },
      inclusion: {
        within: config.eventConfiguration.eventcodes,
        message: "^Not a valid event code %{value}"
      }
    },
    "eventName":{
      presence: {
        message: "^Event name is a mandatory field"
      }
    },
    "year":{
      presence: {
        message: "^Registration year is a mandatory field"
      }
    },
    "data.name":{
      presence: {
        message: "^Name is a mandatory field"
      }

    },
    "data.email":{
      presence: true,
      email: {
        message: "^Not a valid email"
      }
    },
    "data.phoneNo":{
      format: {
        pattern: phoneNoPattern,
        message: "^Not a valid phone number. Valid eg: (111)-111-1111"
      }
    },
    "data.isMember": function(value, attributes, attributeName, options, constraints){

      if(validator.isEmpty(value)){
        return {
          presence: {
            message: "^isMember flag can't be empty and should always be boolean type (true or false)"
          }
        }
      }else if(!validator.isBoolean(value)){
        return {
          inclusion:{
            within: [true,false],
            message: "^isMember should always be boolean (true or false)"
          }
        }
      }
    },
    "data.isVegiterian": function(value, attributes, attributeName, options, constraints){

      if(validator.isEmpty(value)){
        return {
          presence: {
            message: "^isVegiterian flag can't be empty and should always be boolean type (true or false)"
          }
        }
      }else if(!validator.isBoolean(value)){
        return {
          inclusion:{
            within: [true,false],
            message: "^isVegiterian should always be boolean (true or false)"
          }
        }
      }
    },
    "data.isStudent": function(value, attributes, attributeName, options, constraints){

      if(validator.isEmpty(value)){
        return {
          presence: {
            message: "^isStudent flag can't be empty and should always be boolean type (true or false)"
          }
        }
      }else if(!validator.isBoolean(value)){
        return {
          inclusion:{
            within: [true,false],
            message: "^isStudent should always be boolean (true or false)"
          }
        }
      }
    },
    "data.hasFamily": function(value, attributes, attributeName, options, constraints){

      if(validator.isEmpty(value)){
        return {
          presence: {
            message: "^hasFamily flag can't be empty and should always be boolean type (true or false)"
          }
        }
      }else if(!validator.isBoolean(value)){
        return {
          inclusion:{
            within: [true,false],
            message: "^hasFamily should always be boolean (true or false)"
          }
        }
      }
    },
    "data.noOfAdults":function(value, attributes, attributeName, options, constraints){
      if(!attributes.data.hasFamily){
        return{
          presence:{
            message:"^No of adults field is required"
          },
          numericality:
          {
            onlyInteger: true,
            strict:true,
            equalTo: 1,
            message: "^Non family participants can't have more than one head count"
          }
        }
      }else{
        return{
          presence:{
            message:"^No of adults field is required"
          },
          numericality:
          {
            onlyInteger: true,
            strict:true,
            greaterThan: 0,
            message: "^No of adults can't be less than 1 or real numbers"
          }
        }
      }
    },
    "data.noOfChildren":function(value, attributes, attributeName, options, constraints){
      if(!attributes.data.hasFamily){
        return{
          numericality:
          {
            onlyInteger: true,
            strict:true,
            equalTo: 0,
            message: "^hasFamily has to be true for someone to bring children"
          }
        }
      }else{
        return{
          numericality:
          {
            onlyInteger: true,
            strict:true,
            greaterThanOrEqualTo:0,
            message: "^No of children can't be less than 0 or real numbers"
          }
        }
      }

    },
    "data.membershipFee":{
      numericality:
      {
        onlyInteger: true,
        strict:true,
        equalTo: 25,
        message: "^Membership fee is $25 dollars. Please put the exact figure without dollar sign"
      }
    },
    "data.sponsorshipCategory":{
      inclusion: {
        within: config.eventConfiguration.sponsorshipOptions,
        message: "^Not a valid Sponsorship option %{value}. Valid values ['Platinum','Gold','Silver','Bronze'] and these are case sensitive"
      }
    },
    "data.eventFee":function(value, attributes, attributeName, options, constraints){
      console.log("attributes : \n"+ JSON.stringify(attributes))
      console.log("attribute Name : \n"+ JSON.stringify(attributeName))
      if(attributes.data.sponsorshipCategory in [])
      return{
        present:true
      }
    }
  }
  validationResult = validator(inputData,validationRules);
  console.log("validationResult "+ JSON.stringify(validationResult));
  next("error")
}
