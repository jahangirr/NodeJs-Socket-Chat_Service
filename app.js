var express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
 res.sendfile(__dirname + '/public/index.html');
});


var usernames = {};

io.sockets.on('connect', function (socket) {

 socket.on('sendchat', function (data) {
 io.sockets.emit('updatechat', socket.username, data);
 });

console.log('user Image Before');

socket.on('user image', function (msg) {
        //Received an image: broadcast to all
        console.log('before --- insert');
        console.log(msg);
        io.sockets.emit('user image', socket.username, msg);
 });


console.log('user Image After');

 socket.on('adduser', function(username){
 socket.username = username;
 usernames[username] = username;
 socket.emit('updatechat', 'SERVER', 'you have connected --- '+ username );
 socket.broadcast.emit('updatechat', 'SERVER'
 , username + ' has connected');
 io.sockets.emit('updateusers', usernames);
 });


 socket.on('disconnect', function(){
 delete usernames[socket.username];
 io.sockets.emit('updateusers', usernames);
 socket.broadcast.emit('updatechat', 'SERVER'
 , socket.username + ' has disconnected');
 });



});
var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);