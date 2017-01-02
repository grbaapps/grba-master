exports.addRoutes = function(app, event) {

app.get('/api/currentEvent', event.getCurrentEvent);

app.get('/api/eventDetails', event.getEventDetails);
    
};