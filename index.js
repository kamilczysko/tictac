let express = require("express");
let app = express();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

app.get("/tictac", function(req, res){
	res.sendFile("index.html", {root: "game"});
});

app.use("/tictac", express.static("game"));

io.on("connection", function(socket){
	console.log("connected");
	socket.on("disconnect", function(){
		console.log("disconnected");
	});
	socket.on("doThing", function(msg){
		console.log("message: "+msg['rowNum']);
		socket.broadcast.emit("selectedPos", msg);
	});
	socket.on("clear", function(msg){
		socket.broadcast.emit("clear", "clear");
	});
});

http.listen(3000, function(){
	console.log("Server listen on port 3000");
});