var path = require('path');
var successStatus = "Success"

var fs = require("fs");
var async = require("async")
var logger = require('./logModule');
var registration = {
        register: function(req, res, next) {

            try {
                var newData = req.body;

                logger.debug("request body : "+ JSON.stringify(newData))
                var fileName = path.resolve(__dirname, '../data') + '/' + newData.year + '_registration.json';
                async.auto({
                    check_file_or_create: function(callback) {

                        fs.exists(fileName, (exists) => {
                            var fileData = '';
                            if (!exists) {
                                fileData = createFileData(newData);
                            } else {
                                logger.debug("File exists. Checking if file is blank")
                                var fileSize = fs.statSync(fileName)["size"];
                                logger.debug("File size is :" + fileSize)
                                if (fileSize <= 0) {
                                    fileData = createFileData(newData);
                                }

                            }
                            callback(null, fileData)
                        });
                    },
                    read_data: ["check_file_or_create", function(results, callback) {
                        // async code to get some data
                        logger.debug("results from check_file_or_create \n" + JSON.stringify(results))
                        if (results['check_file_or_create'] == '') {
                            fs.readFile(fileName, 'utf8', function(err, data) {
                                if (err) return callback(err, "Error");
                                data = JSON.parse(data)
                                mainEvent = data.events[newData.eventCode];

                                if(mainEvent){
                                  mainEvent.registrations.push(newData.data);

                                }else{
                                  //event is not created yet (first registration). Hemce, creating the event
                                  var newEvent = {
                                      "name": newData.eventName,
                                      "eventCode": newData.eventCode,
                                      "registrations": [newData.data]
                                  }
                                  data.events[newData.eventCode] = newEvent;
                                }
                                callback(null, data);

                            });
                        } else {
                            var newFileData = results['check_file_or_create'];
                            logger.debug("new File data \n" + JSON.stringify(newFileData))
                            newFileData.events[newData.eventCode].registrations.push(newData.data);
                            callback(null, newFileData);
                        }

                    }],
                    write_file: ['read_data', function(results, callback) {
                        logger.debug('in write_file', JSON.stringify(results));
                        fs.writeFile(fileName, JSON.stringify(results["read_data"]), 'utf-8', (err) => {
                            if (err) callback(err, "Write Error");
                        });
                        callback(null, 'filename');
                    }]
                }, function(err, results) {
                    if (err) {
                        return next(err)
                    } else {
                        res.status(200);
                        res.send(successStatus)
                    }
                });
            } catch (e) {
                res.status(500);
                return next(e);
            }

        },
        getRegisteredMembers: function(req, res, next) {
            try {
                res.json(result);
            } catch (e) {
                res.status(500);
                return next(e);
            }

        },
        getRegisteredMember: function(req, res, next) {
            try {
                res.json(result);
            } catch (e) {
                res.status(500);
                return next(e);

            }
        }
      }

        function createFileData(newData) {
            var obj = {};
            var events={};
            var eventCode = newData.eventCode;
            events[eventCode] = {
                "name": newData.eventName,
                "eventCode": eventCode,
                "registrations": []
            };
            obj["events"] = events;
            return obj;
        }

        function writeToRegistrationFile() {

        }

        module.exports = registration;
