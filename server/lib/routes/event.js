exports.addRoutes = function(app, event) {

app.get('/api/currentEvent', event.getCurrentEvent);

};