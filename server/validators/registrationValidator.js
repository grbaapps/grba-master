var validator = require('validate.js')
var logger = require('../lib/logModule');
var eventObj = require("../data/event.json");
var moment = require('moment');
exports.validatePost = function(req, res, next) {
    var inputData = req.body;
    var config = req.globalConfig;
    //checking if event details have been updated or not based on non early bird event fee definition
    if (eventObj[inputData.year] && eventObj[inputData.year][inputData.eventCode] && eventObj[inputData.year][inputData.eventCode].afterEarlyBird) {
        var dateTimeFormat = config.eventConfiguration.dateTimeFormat;
        var now = moment();
        //checking if online registration is still available
        if(now.isBefore(moment(eventObj[inputData.year][inputData.eventCode].lastOnlineDateRegistration,dateTimeFormat))){
          logger.debug("Inside validator : \n" + JSON.stringify(config))
          var phoneNoPattern = /\(\d{3}\)-\d{3}-\d{4}/;
          var validationRules = {
              "eventCode": {
                  presence: {
                      message: "^Event code is a mandatory field"
                  },
                  inclusion: {
                      within: config.eventConfiguration.eventcodes,
                      message: "^Not a valid event code %{value}"
                  }
              },
              "eventName": mandatoryFieldRule("Event Name"),
              "year": mandatoryFieldRule("Registration year"),
              "data.name": mandatoryFieldRule("Name"),
              "data.email": {
                  presence: {
                    message: "^Email is amandatory field"
                  },
                  email: {
                      message: "^Not a valid email id"
                  }
              },
              "data.phoneNo": {
                  format: {
                      pattern: phoneNoPattern,
                      message: "^Not a valid phone number. Valid eg: (111)-111-1111"
                  }
              },
              "data.isMember": function(value, attributes, attributeName, options, constraints) {
                  return simpleBooleanRule(value,"isMember")
              },
              "data.isVegetarian": function(value, attributes, attributeName, options, constraints) {
                  return simpleBooleanRule(value,"isVegetarian")
              },
              "data.isStudent": function(value, attributes, attributeName, options, constraints) {
                  return simpleBooleanRule(value,"isStudent")
              },
              "data.hasFamily": function(value, attributes, attributeName, options, constraints) {
                  return simpleBooleanRule(value,"hasFamily")
              },
              "data.noOfAdults": function(value, attributes, attributeName, options, constraints) {
                  if (!attributes.data.hasFamily) {
                      return {
                          presence: {
                              message: "^No of adults field is mandatory"
                          },
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              equalTo: 1,
                              message: "^Non family participants can't have more than one adult"
                          }
                      }
                  } else {
                      return {
                          presence: {
                              message: "^No of adults field is mandatory"
                          },
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              greaterThan: 0,
                              message: "^No of adults can't be less than 1 or real numbers"
                          }
                      }
                  }
              },
              "data.noOfChildren": function(value, attributes, attributeName, options, constraints) {
                  if (!attributes.data.hasFamily) {
                      return {
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              equalTo: 0,
                              message: "^hasFamily has to be true for someone to bring children"
                          }
                      }
                  } else {
                      return {
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              greaterThanOrEqualTo: 0,
                              message: "^Number of children can't be less than 0 or real numbers"
                          }
                      }
                  }

              },
              "data.membershipFee": function(value, attributes, attributeName, options, constraints){
				  var membershipFee = (attributes.data.hasFamily?config.grbaMembershipFee.family:config.grbaMembershipFee.single)
				 return {
					  numericality: {
                      onlyInteger: true,
                      strict: true,
                      equalTo: membershipFee,
                      message: "^Membership fee is $"+membershipFee+". Don't put $ sign."
						}
					}
              },
              "data.sponsorshipCategory": {
                  inclusion: {
                      within: eventObj[inputData.year][inputData.eventCode].sponsorship,
                      message: "^Not a valid Sponsorship option %{value}"
                  }
              },
              "data.eventFee": function(value, attributes, attributeName, options, constraints) {
                  logger.debug("attributes : \n" + JSON.stringify(attributes))
                  logger.debug("attribute Name : \n" + JSON.stringify(attributeName))
                  var sponsorshipCategory = attributes.data.sponsorshipCategory;
                  //Checking if user wants to sponsor
                  if(sponsorshipCategory){
                    //Checking if the specific sponsorship option available for this event
                    if(eventObj[inputData.year][inputData.eventCode]["sponsorship"] && eventObj[inputData.year][inputData.eventCode]["sponsorship"][sponsorshipCategory]){
                      var eventSponsorshipValue = eventObj[inputData.year][inputData.eventCode]["sponsorship"][sponsorshipCategory]
                      return {
                          presence:{
                            message: "^Event fee is mandatory field and equal to sponsorship"
                          },
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              equalTo: eventSponsorshipValue,
                              message: "^Event fee has to match with the sponsorship."
                          }
                      }
                    }else{
                      //already has issue with sponsorship issue hence nothing to validate with event fee field
                      return null;
                    }
                  } else if(inputData.eventCode == "AP"){
                     // No validation needed on event fee as it's a free event.
                      return null;
                  }else {
                      var infoObj = {
                          "dateTimeFormat": dateTimeFormat,
                          "isMember": attributes.data.isMember,
                          "hasFamily": attributes.data.hasFamily,
                          "year": inputData.year,
                          "eventCode": inputData.eventCode,
                          "date": now,
                          "isStudent":inputData.data.isStudent
                      };
                      var eventFee = determineEventFee(infoObj,next);
                      logger.debug("eventfee is : " + eventFee);
                      return {
                          presence: {
                              message: "^Event fee is a mandatory field."
                          },
                          numericality: {
                              onlyInteger: true,
                              strict: true,
                              equalTo: eventFee,
                              message: "^Event fee is not correct. your event fee is $" + eventFee
                          }
                      }
                  }

              }
          }
          validationResult = validator(inputData, validationRules);
          if(validationResult){
            //validation error present
            res.status(400);
            return res.send(validationResult);
          }else{
            //go ahead with the registration
            req.body.data.registrationDate=now.format(dateTimeFormat);
            next();
          }


        }else{
          logger.info("The online registraion is closed now");
          res.status(403)
          return res.send({
              "message": "The online registraion is closed now"
          });
        }

    } else {
        res.status(400)
        return res.send({
            "message": "The event has not been created by admin team"
        });
    }

}
exports.validateGetForSpecificEvent = function(req, res, next){
	var searchObj = req.body;
	var config = req.globalConfig;
	var searchCriteria = {"year":req.params.year,"eventCode":req.params.eventCode,"value":req.query.value,"searchBy":req.query.searchBy,"sort":req.query.sort};
	logger.debug("search Object : "+ JSON.stringify(searchCriteria))
	var validationCriteria = {
		"year": {
                  presence: {
                      message: "^Must provide to search for registration."
                  },
                  numericality: {
                              onlyInteger: true,
                              strict: true,
                              message: "^Please provide a valid year."
                  }
              },
		"eventCode": {
                  presence: {
                      message: "^Event code is a mandatory field."
                  },
                  inclusion: {
                      within: config.eventConfiguration.eventcodes,
                      message: "^Not a valid event code %{value}. Valid values "+config.eventConfiguration.eventcodes+"."
                  }
              },
    "searchBy":function(value, attributes, attributeName, options, constraints){
      if(attributes.value){
        return {
          presence:{
            message: "^Please provide valid search by options "+ config.searchByOptions+"."
          },
          inclusion: {
                        within: config.searchByOptions,
                        message: "^not a valid search by options. Valid options are "+config.searchByOptions+"."
                  }
        }
      }else{
        return null;
      }


		},
		"value" :function(value, attributes, attributeName, options, constraints){
          if(attributes.searchBy){
            if(attributes.searchBy === "email"){
              return {
  							presence : {
  								message: "^Please provide a value to search for."
  							},
                email: {
                    message: "^Not a valid email id"
                }
  						}
            }else{
              return {
  							presence : {
  								message: "^Please provide a value to search for."
  							}
  						}
            }
          }else{
						return null
					}
		}
	}

	validationResult = validator(searchCriteria, validationCriteria);
          if(validationResult){
            //validation error present
            res.status(400);
            return res.send(validationResult);
          }else{
            //go ahead with the registration

            next();
          }
}
function determineEventFee(infoObj,next) {
    //determine if early bird and fetch fee data accordingly
    var fee = "";
    var earlyBirdDate = "";
    var totalFee = 0;
    var now = infoObj.date;
    var isMember = infoObj.isMember;
    var hasFamily = infoObj.hasFamily;
    var year = infoObj.year;
    var eventCode = infoObj.eventCode;
    var dateTimeFormat = infoObj.dateTimeFormat;
    var isStudent=infoObj.isStudent;
    try{
      if (eventObj[year][eventCode].earlyBird) {
          earlyBirdDate = moment(eventObj[year][eventCode].earlyBird.date, dateTimeFormat);
          logger.debug("now : "+ now.format(dateTimeFormat))
          logger.debug("earlyBird : "+ earlyBirdDate.format(dateTimeFormat))
          if (now.isSameOrBefore(earlyBirdDate)) {
              fee = eventObj[year][eventCode].earlyBird.fee;
          } else {
              fee = eventObj[year][eventCode].afterEarlyBird.fee;
          }
      } else {
          fee = eventObj[year][eventCode].afterEarlyBird.fee;
          //derive non early-bird fee
      }
      if(isStudent){
        fee = fee.student;
      }else{
        fee = fee.nonStudent;
      }
      if (isMember) {
          if (hasFamily) {
              totalFee = fee.member.family;
          } else {
              totalFee = fee.member.single;
          }
      } else {
          if (hasFamily) {
              totalFee = fee.nonmember.family;
          } else {
              totalFee = fee.nonmember.single;
          }
      }
    }catch(e){
      logger.error("Error in fee calculation : " +e.stack);
      return next(e);
    }

    return totalFee;

}
function mandatoryFieldRule(fieldName){
  return {
    presence : {
      message : "^"+fieldName+" is a mandatory field"
    }
  }
}
function simpleBooleanRule(value, fieldName){
  if (validator.isEmpty(value)) {
      return {
          presence: {
              message: "^"+fieldName+" is a mandatory field"
          }
      }
  } else if (!validator.isBoolean(value)) {
      return {
          inclusion: {
              within: [true, false],
              message: "^"+fieldName+" should always be boolean"
          }
      }
  }
}
