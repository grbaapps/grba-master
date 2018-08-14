var express = require('express');

exports.addRoutes = function (app, config) {
    app.use(config.server.staticUrl, express.static(config.server.distFolder));

    app.get(config.server.staticUrl, function (req, res, next) {
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });

    app.get(config.server.staticUrl + 'about', function (req, res, next) {
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });


    app.get(config.server.staticUrl + 'event', function (req, res, next) {
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });

    app.get(config.server.staticUrl + 'contact', function (req, res, next) {
        res.sendFile('index.html', {
            root: config.server.distFolder
        })
    });

};
