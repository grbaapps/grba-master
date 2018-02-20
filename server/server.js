var http = require('http');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser')

var express = require('express');
var config = require('./config.js');
var event = require('./lib/event');
var protectJSON = require('./lib/protectJSON');
var pgp = require('pg-promise');
var logger = require('./lib/logModule');

var cluster = require('cluster');

var workers = config.server.workers || require('os').cpus().length;
//var db = pgp(config.postgres.dbUrl); // Uncomment this when DB is setup


var app = express();
app.set('port', (process.env.PORT || config.server.listenPort));

var server = http.createServer(app);

require('./lib/routes/static').addRoutes(app, config);
app.use(compression())
app.use(protectJSON);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded                             // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(cookieParser(config.server.cookieSecret));
app.use(addConfigurationToRequest)  // Hash cookies with this secret
//app.use(express.cookieSession());                           // Store the session in the (secret) cookie





app.use('/api/registration',require('./lib/routes/registration'));
app.use('/api/volunteer-events',require('./lib/routes/volunteer-events'));
require('./lib/routes/event').addRoutes(app, event);


//This should be the last middleware.
app.use(errorHandler)

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  logger.error("Internal server error : "+ err.stack);
  res.status(500)
  res.send({ error: 'Internal server error! Please see the application logs' })
}
function addConfigurationToRequest(req,res,next){
  //Adding config in global request context, so that other router can avail the configuration
  req.globalConfig = config;
  next();
}

if (cluster.isMaster) {

  console.log('start cluster with %s workers', workers);

  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid);
  }

  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });

} else {
  server.listen(app.get('port'), '0.0.0.0', 511, function() {
    console.log('Angular App Server - listening on port: ' + app.get('port'));
  });
}
