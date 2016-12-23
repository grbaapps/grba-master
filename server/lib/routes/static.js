var express = require('express');

exports.addRoutes = function(app, config) {
  // Serve up the favicon
  //app.use(express.favicon(config.server.distFolder + '/favicon.ico'));
  app.use(config.server.staticUrl, express.static(config.server.distFolder));
  app.use(config.server.staticUrl, function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};