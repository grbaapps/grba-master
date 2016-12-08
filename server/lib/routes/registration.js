exports.addRoutes = function(app, registration) {

app.post('/api/register', registration.register);

app.get('/api/registeredMembers', registration.getRegisteredMembers);



};