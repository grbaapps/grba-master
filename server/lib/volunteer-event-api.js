var logger = require('./logModule');
var aws = require('aws-sdk');
var volunteerEvent = {
    get: function(req, res, next) {
        try {
            var fileName = req.params.year + '_volunteer_events.json';
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
                    logger.error(err);
                    if (err.statusCode && err.statusCode == 404) {
                        //Registration file does not exist. Throw 404
                        var returnObj = {
                            "status": 404,
                            "message": "There are no volunteer events available."
                        }
                        res.status(404);
                        return res.send(returnObj);
                    } else {
                        return next(err);
                    }
                } else if (data.Body.length == 0) {
                    var returnObj = {
                        "status": 404,
                        "message": "There are no volunteer events available."
                    }
                    res.status(404);
                    return res.send(returnObj);
                } else {
                    data = JSON.parse(data.Body.toString('utf-8'));
                    logger.warn(JSON.stringify(data));
                    mainEvent = data.events[req.params.eventCode];
                    if (mainEvent) {
                        res.status(200);
                        return res.send(mainEvent.details);

                    } else {
                        //event does not exist. throw 404
                        var returnObj = {
                            "status": 404,
                            "message": "There are no volunteer event available for this eventcode."
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

    },
    list: function(req, res, next) {
        try {
            var fileName = req.params.year + '_volunteer_events.json';
            var config = req.globalConfig;
            var s3 = new aws.S3({
                "accessKeyId": process.env.accessKey,
                "secretAccessKey": process.env.secretAccessKey
            });

            var params = {
                "Bucket": config.aws.s3Bucket,
                "Key": fileName,

            }
            var fileData = "";
            s3.getObject(params, function(err, data) {
                if (err) {
                  logger.error(err);
                  if (err.statusCode && err.statusCode == 404) {
                      //Registration file does not exist. Throw 404
                      var returnObj = {
                          "status": 404,
                          "message": "There are no volunteer events available."
                      }
                      res.status(404);
                      return res.send(returnObj);
                  } else {
                      return next(err);
                  }
                } else if (data.Body.length == 0) {
                    var returnObj = {
                        "status": 404,
                        "message": "There are no volunteer events available."
                    }
                    res.status(404);
                    return res.send(returnObj);
                } else {
                    data = JSON.parse(data.Body.toString('utf-8'));
                    res.status(200);
                    return res.send(data.events);
                }
            });
        } catch (e) {
            res.status(500);
            return next(e);
        }

    }

}



module.exports = volunteerEvent;
