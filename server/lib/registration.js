var path = require('path');
var successObj = {
    "email": "",
    "totalPaymentAmount": 0,
    "paypalPaymentAmount": 0
}

var fs = require("fs");
var async = require("async")
var logger = require('./logModule');
var aws = require('aws-sdk');
var registration = {
    register: function(req, res, next) {
        var config = req.globalConfig;
        var s3 = new aws.S3({
            "accessKeyId": process.env.accessKey,
            "secretAccessKey": process.env.secretAccessKey
        });
        try {
            logger.info("*****The accessKeyId is : "+process.env.accessKey);
            logger.info("*****The secretAccessKey is : "+process.env.secretAccessKey);
            var newData = req.body;

            logger.debug("request body : " + JSON.stringify(newData))
            var fileName = newData.year + '_registration.json';
            async.auto({
                check_file_or_create: function(callback) {
                    //S3 operations
                    var params = {
                        Bucket: config.aws.s3Bucket,
                        Key: `registration/${fileName}`
                    }
                    var fileData = "";
                    s3.getObject(params, function(err, data) {
                        if (err) {
                            if (err.statusCode && err.statusCode == 404) {
                                fileData = createFileData(newData);
                                return callback(null, fileData);
                            } else {
                                return callback(err);
                            }
                        } else if (data.Body.length == 0) {
                            logger.debug('inside blank file section : ');
                            fileData = createFileData(newData);
                        } else {
                            fileData = JSON.parse(data.Body.toString('utf-8'));
                        }
                        return callback(null, fileData);
                    });

                },
                read_data: ["check_file_or_create", function(results, callback) {
                    // async code to get some data
                    logger.debug("results from check_file_or_create \n" + JSON.stringify(results))
                    data = results['check_file_or_create'];
                    mainEvent = data.events[newData.eventCode];
                    if (mainEvent) {
                        if (!checkIfDuplicateByEmail(mainEvent.registrations, newData.data.email)) {
                            mainEvent.registrations.push(newData.data);
                        } else {
                            //Duplicate email id. Can't register
                            var errorObj = {
                                "key": "data.email",
                                "errorCode": "duplicate_email",
                                "errorMessage": "Duplicate registration. Another registration record exist with same email id."
                            }
                            return callback(errorObj);
                        }


                    } else {
                        //event is not created yet (first registration). Hemce, creating the event
                        var newEvent = {
                            "name": newData.eventName,
                            "eventCode": newData.eventCode,
                            "registrations": [newData.data]
                        }
                        data.events[newData.eventCode] = newEvent;
                    }
                    return callback(null, data);

                }],
                write_file: ['read_data', function(results, callback) {
                    logger.debug('in write_file', JSON.stringify(results));
                    var newResults = calculateTotalAdultsAndChildren(results["read_data"]["events"][newData.eventCode].registrations);
                    var params = {
                        Bucket: config.aws.s3Bucket,
                        Key: `registration/${fileName}`,
                        ContentEncoding: 'utf-8',
                        Body: JSON.stringify(results["read_data"]),
                        "ServerSideEncryption": "AES256"
                    }
                    s3.putObject(params, function(err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            return callback(null, newResults);
                        }
                    });

                }]
            }, function(err, results) {
                if (err) {
                    if (err.errorCode && err.errorCode == "duplicate_email") {
                        var errorObject = {}
                        errorObject[err.key] = [err.errorMessage];

                        res.status(400);
                        return res.send(errorObject)
                    } else {
                        return next(err)
                    }

                } else {
                    successObj.email = newData.data.email;
                    successObj.noOfAdults = results['write_file'].noOfAdults ? results['write_file'].noOfAdults : "NA";
                    successObj.children = results['write_file'].children ? results['write_file'].children : "NA";
                    var totalFee = 0;
                    if (newData.data.membershipFee) {
                        totalFee = parseInt(newData.data.eventFee) + parseInt(newData.data.membershipFee);
                    } else {
                        totalFee = parseInt(newData.data.eventFee);
                    }
                    successObj.totalPaymentAmount = totalFee;
                    successObj.paypalPaymentAmount = (totalFee * 1.029 + 0.3).toFixed(2);
                    res.status(200);
                    res.send(successObj)
                }
            });
        } catch (e) {
            res.status(500);
            return next(e);
        }

    },
    getRegisteredMembers: function(req, res, next) {
        try {
            var fileName = req.params.year + '_registration.json';
            var config = req.globalConfig;
            var s3 = new aws.S3({
                "accessKeyId": process.env.accessKey,
                "secretAccessKey": process.env.secretAccessKey
            });

            var params = {
                "Bucket": config.aws.s3Bucket,
                "Key": `registration/${fileName}`,

            }
            logger.info("*****The accessKeyId is : "+process.env.accessKey);
            logger.info("*****The secretAccessKey is : "+process.env.secretAccessKey);
            logger.debug("params : " + JSON.stringify(params))
            var fileData = "";
            s3.getObject(params, function(err, data) {
                if (err) {
                    if (err.statusCode && err.statusCode == 404) {
                        //Registration file does not exist. Throw 404
                        var returnObj = {
                            "status": 404,
                            "message": "There are no registrations available."
                        }
                        res.status(404);
                        return res.send(returnObj);
                    } else {
                        return next(err);
                    }
                } else if (data.Body.length == 0) {
                    var returnObj = {
                        "status": 404,
                        "message": "There are no registrations available."
                    }
                    res.status(404);
                    return res.send(returnObj);
                } else {
                    data = JSON.parse(data.Body.toString('utf-8'));
                    mainEvent = data.events[req.params.eventCode];
                    if (mainEvent) {
                        //prepare return data
                        var returnObj = {
                            "totalNoOfRegistrations": mainEvent.registrations.length
                        }
                        var searchByOption = req.query.searchBy;
                        if (searchByOption) {
                            var registrations = "";
                            if (searchByOption === "name") {
                                registrations = filterSearchResultsByName(mainEvent.registrations, req.query.value);
                            } else {
                                registrations = filterSearchResultsByExactFieldValue(mainEvent.registrations, req.query.value, searchByOption);
                            }
                            returnObj["lengthOfSearchResult"] = registrations.length;
                            returnObj["registrations"] = registrations;

                        } else {
                            //no search option provided. Hence return full set of data
                            returnObj["lengthOfSearchResult"] = mainEvent.registrations.length;
                            returnObj["registrations"] = mainEvent.registrations;

                        }
                        var adultChildrenCount = calculateTotalAdultsAndChildren(mainEvent.registrations);
                        returnObj.children = adultChildrenCount.children
                        returnObj.noOfAdults = adultChildrenCount.noOfAdults;
                        res.status(200);
                        return res.send(returnObj);

                    } else {
                        //event does not exist. throw 404
                        var returnObj = {
                            "status": 404,
                            "message": "There are no registrations available."
                        }
                        res.status(404);
                        return res.send(returnObj);
                    }
                }
            });
        } catch (e) {
            res.status(500);
            return next(e);
        }

    }
}

function createFileData(newData) {
    var obj = {};
    var events = {};
    var eventCode = newData.eventCode;
    events[eventCode] = {
        "name": newData.eventName,
        "eventCode": eventCode,
        "registrations": []
    };
    obj["events"] = events;
    return obj;
}

function checkIfDuplicateByEmail(registrationArr, email) {
    for (var i = 0; i < registrationArr.length; i++) {
        if (registrationArr[i].email === email) {
            return true;
        }
    }
    return false;
}

function filterSearchResultsByExactFieldValue(allRegistartions, value, fieldName) {
    var returnObj = [];
    for (var i = 0; i < allRegistartions.length; i++) {
        if (allRegistartions[i][fieldName] && allRegistartions[i][fieldName] == value) {
            returnObj.push(allRegistartions[i]);
        }
    }
    return returnObj;
}

function filterSearchResultsByName(allRegistartions, value) {
    var regExp = new RegExp(".*" + value + ".*", "i");
    var returnObj = [];
    for (var i = 0; i < allRegistartions.length; i++) {
        if (regExp.test(allRegistartions[i]["name"])) {
            returnObj.push(allRegistartions[i]);
        }
    }
    return returnObj;
}

function calculateTotalAdultsAndChildren(registrations) {

    var totalChildren0To3Count = 0;
    var totalChildren4To12Count = 0;
    var totalChildren12AboveCount = 0;
    var totalAdultCount = 0;
    registrations.forEach(function(object, index, arr) {
        if (object.noOfChildren0to3) {
            totalChildren0To3Count += object.noOfChildren0To3;
        }
        if (object.noOfChildren4to12) {
            totalChildren4To12Count += object.noOfChildren4To12;
        }
        if (object.noOfChildren12Above) {
            totalChildren12AboveCount += object.noOfChildren12Above;
        }
        totalAdultCount += object.noOfAdults;
    });
    return {
        "children": {
            "totalChildren0To3": totalChildren0To3Count,
            "totalChildren4To12": totalChildren4To12Count,
            "totalChildren12Above": totalChildren12AboveCount,
        },
        "noOfAdults": totalAdultCount
    }
}

module.exports = registration;
