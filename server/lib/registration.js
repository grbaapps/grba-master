var path = require('path');
var successStatus = "Success"

var fs = require("fs");
var async = require("async")

var registration = {
  register: function(req, res, next) {
      var newData = req.body;
      var fileName =path.resolve(__dirname, '../data')+'/'+newData.year+'_registration.json';
      async.auto({
        check_file_or_create: function(callback){

          fs.exists(fileName, (exists) => {
            var fileData = '';
            if(!exists){
              fileData = createFileData(newData,fileName);
            }else {
              console.log("File exists. Checking if file is blank")
              var fileSize = fs.statSync(fileName)["size"];
              console.log("File size is :"+ fileSize)
              if(fileSize <= 0){
                fileData = createFileData(newData,fileName);
              }

            }
            callback(null,fileData)
          });
        },
    read_data: ["check_file_or_create",function(results,callback) {
        // async code to get some data
        console.log("results from check_file_or_create \n"+ JSON.stringify(results ))
        if(results['check_file_or_create'] == ''){
          fs.readFile(fileName, 'utf8',function (err, data) {
              if (err) callback(err, "Error");
              data = JSON.parse(data)
              eventsArray = data.events;
              for(i=0 ; i< eventsArray.length; i++){
                //add registration to the existing event
                if(eventsArray[i]["name"] == newData.eventName){
                  console.log("Event Name matched :"+ newData.eventName)
                  eventsArray[i].registrations.push(newData.data);
                  break;
                }
              }
              //event is not created yet. Hemce, creating the event
              if (i == eventsArray.length) {
                var newEvent = {"name":newData.eventName,"registrations":[newData]}
                eventsArray.push(newEvent);
              }
              callback(null,data);

          });
        }else{
            var newFileData = results['check_file_or_create'];
            console.log("new File data \n"+ JSON.stringify(newFileData ))
            newFileData.events[0].registrations.push(newData.data);
            callback(null,newFileData);
        }

    }],
    write_file: ['read_data', function(results, callback) {
        console.log('in write_file', JSON.stringify(results));
        fs.writeFile(fileName, JSON.stringify(results["read_data"]),'utf-8', (err) => {
          if (err) callback(err,"Write Error");
          console.log('It\'s saved!');
        });
        callback(null, 'filename');
    }]
}, function(err, results) {
    if(err){
      next(err)
    }else{
      res.status(200);
      res.send(successStatus)
    }
});
  },
  getRegisteredMembers: function(req, res, next) {
    res.json(result);
  },
  getRegisteredMember: function(req, res, next) {
    res.json(result);
  }
};
function createFileData(newData){
  var newData = {"events":[{
    "name":newData.eventName,
    "registrations": []
  }]};
  return newData;
}

function writeToRegistrationFile(){

}

module.exports = registration;
