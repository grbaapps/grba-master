var path = require('path');
var fs = require("fs");
var async = require("async")
var logger = require('./logModule');
var aws = require('aws-sdk');
const fileName = "membership.json";
var membership = {
    create: function(req, res, next) {
        var config = req.globalConfig;
        var s3 = new aws.S3({
            "accessKeyId": process.env.accessKey,
            "secretAccessKey": process.env.secretAccessKey
        });
        try {
            logger.info("*****The accessKeyId is : "+process.env.accessKey);
            logger.info("*****The secretAccessKey is : "+process.env.secretAccessKey);
            var newData = req.body;

            logger.debug("request body : " + JSON.stringify(newData));
            async.auto({
                read: function(callback) {
                    //S3 operations
                    var params = {
                        Bucket: config.aws.s3Bucket,
                        Key: fileName
                    }
                    var fileData = "";
                    s3.getObject(params, function(err, data) {
			const member = createMemberObject(newData);
			const emailID = newData.emailID;
			const members = {};
                        if (err) {
                            if (err.statusCode && err.statusCode == 404) {
                                members[emailID] = member;
                                return callback(null, fileData);
                            } else {
                                return callback(err);
                            }
                        } else if (data.Body.length == 0) {
                            logger.debug('inside blank file section : ');
                            members[emailID] = member;
                        } else {
                            members = JSON.parse(data.Body.toString('utf-8'));
			    if (members[emailID]) {
				//Duplicate email id. Can't do
                            	var errorObj = {
                                  "key": "data.email",
                                  "errorCode": "duplicate_email",
                                  "errorMessage": "Duplicate membership. Another member record exist with same email id."
                                }
			    	callback(errorObj);
                            } else {
				members[emailID] = member;
			    } 
                        }
                        return callback(null, members);
                    });

                },
                write: ['read', function(results, callback) {
                    logger.debug('in write_file', JSON.stringify(results));
                    var params = {
                        Bucket: config.aws.s3Bucket,
                        Key: fileName,
                        ContentEncoding: 'utf-8',
                        Body: JSON.stringify(results["read"]),
                        "ServerSideEncryption": "AES256"
                    }
                    s3.putObject(params, function(err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            return callback(null, "success");
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
                    res.status(204);
                    res.send("member successfully created")
                }
            });
        } catch (e) {
            res.status(500);
            return next(e);
        }

    },
    read: function (req, res, next) {
        try {
            var config = req.globalConfig;
            var s3 = new aws.S3({
                "accessKeyId": process.env.accessKey,
                "secretAccessKey": process.env.secretAccessKey
            });

            var params = {
                "Bucket": config.aws.s3Bucket,
                "Key": fileName,

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
                            "message": "There are no members available."
                        }
                        res.status(404);
                        return res.send(returnObj);
                    } else {
                        return next(err);
                    }
                } else if (data.Body.length == 0) {
                    var returnObj = {
                        "status": 404,
                        "message": "There are no members available."
                    }
                    res.status(404);
                    return res.send(returnObj);
                } else {
                    data = JSON.parse(data.Body.toString('utf-8'));
		            const emailID = req.params.emailID;
                    member = data[emailID];
                    if (emailID) {
			            if (data[emailID]) {
			                res.status(200);
                            return res.send(data[emailID]);
			            } else {
			                //event does not exist. throw 404
                            var returnObj = {
                            "status": 404,
                            "message": "Member does not exist"
                            };
			                res.status(404);
                            return res.send(returnObj);
                        }
                        
                    } else {
                        const retVal = [];
                        Object.keys.array.forEach(element => {
                            retVal.push(data[element]);
                        });
                        res.status(200);
                        return res.send(retVal);
                    }
                }
            });
        } catch (e) {
            res.status(500);
            return next(e);
        }

    }
}

function createMemberObject(newData) {
    const emailID = newData.member.emailID
    let spouseName, spouseEmailID, spouseContactNo;
    if (newData.spouse) {
        spouseName = newData.spouse.name || '';
        spouseEmailID = newData.spouse.emailID || '';
        spouseContactNo = newData.spouse.contactNo || ''
    }
    const membership = {
        type: newData.type,
        member: {
            'name': newData.member.name,
            'emailID': newData.member.emailID,
            'contactNo': newData.member.contactNo
        },
        spouse: {
            'name': spouseName,
            'emailID': spouseEmailID,
            'contactNo': spouseContactNo
        },
        noOfChildren: newData.noOfChildren || 0
    };
    return membership;
}

module.exports = membership;
