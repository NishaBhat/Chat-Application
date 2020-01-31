/*Look at node_modules/socket.io README*/

const path = require("path");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let users = [];
/*Handshake from UI*/
io.on('connection', socket => { 
	console.log("New connection made");
	socket.on('join',function(data){
		socket.nickname = data.nickname;
		users[socket.nickname] = socket;
		let userObj = {
			nickname : data.nickname,
			socketid : socket.id
		}
		users.push(userObj);
		/*This is io.emit instead of socket.emit so we can broadcast the event to all the users*/
		io.emit('all-users',users);
	});
	socket.on('get-users',function(){
		socket.emit('all-users',users);
	});
	socket.on('message-recieved',function(data){
		io.emit('update-chat',data);
	});
	socket.on('send-like',function(data){
		console.log('In send-like');
		console.log(data);
		/*Sends data to a specific socket*/
		socket.broadcast.to(data.to).emit('recieve-like',data);
	});
	/*When a user goes offline*/
	socket.on('disconnect',function(){
		users = users.filter( e => e.nickname != socket.nickname);
		io.emit('all-users',users);
	});
});
/*Links to the UI*/
app.get('/',function(req,res){
	/*Make the client path visible for includes (eg: bootstrap)*/
	app.use(express.static(__dirname + '/public'));
	res.sendFile(__dirname + '/public/index.html');
});
/*Called on server startup*/
server.listen(8080,function(){
	console.log("listening on port 8080");
});

