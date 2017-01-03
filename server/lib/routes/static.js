var express = require('express');

exports.addRoutes = function (app, config) {
    // Serve up the favicon
    //app.use(express.favicon(config.server.distFolder + '/favicon.ico'));
    app.use(config.server.staticUrl, express.static(config.server.distFolder));

    console.log("Inside static.js");

    app.get(config.server.staticUrl, function (req, res, next) {
        console.log("Servicing /");
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });

    app.get(config.server.staticUrl + 'about', function (req, res, next) {
        console.log("Servicing /about");
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });
    

    app.get(config.server.staticUrl + 'event', function (req, res, next) {
        console.log("Servicing /event");
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });    

    app.get(config.server.staticUrl + 'contact', function (req, res, next) {
        console.log("Servicing /contact");
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });     

};