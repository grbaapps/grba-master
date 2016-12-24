var http = require('http');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser')

var express = require('express');
var config = require('./config.js');
var event = require('./lib/event');
var protectJSON = require('./lib/protectJSON');
var pgp = require('pg-promise');
//var db = pgp(config.postgres.dbUrl); // Uncomment this when DB is setup


var app = express();
var server = http.createServer(app);

require('./lib/routes/static').addRoutes(app, config);
app.use(compression())
app.use(protectJSON);

//app.use(express.logger());                                  // Log requests to the console
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded                             // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
//app.use(express.cookieSession());                           // Store the session in the (secret) cookie





app.use('/api/registration',require('./lib/routes/registration'));
require('./lib/routes/event').addRoutes(app, event);
require('./lib/routes/appFile').addRoutes(app, config);

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
  // // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.listenPort + '/app/');
});
console.log('Angular App Server - listening on port: ' + config.server.listenPort);
