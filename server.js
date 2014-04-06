var express = require('express');
var handler = require('./config/handler');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.bodyParser());
app.use(express.static(__dirname + '/app'));

app.get('/api/user/:facebookid', handler.getUser);
app.post('/api/user', handler.postUser);
app.put('/api/user/:facebookid', handler.putUser);
app.delete('/api/user/:facebookid', handler.deleteUser);

app.get('/api/outings/:id', handler.getOuting);
app.post('/api/outings', handler.postOuting);
app.put('/api/outings/:id', handler.putOuting);
app.delete('/api/outings/:id', handler.deleteOuting);

app.listen(port);
console.log('Listening on ' + port);
