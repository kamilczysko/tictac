let express = require("express");
let app = express();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;
let idToNick = new Map();
let idToId = [];

app.get("/", function(req, res){
	res.sendFile("index.html", {root: "game"});
});

app.use("/", express.static("game"));

io.on("connection", function(socket){
	console.log("connected");
	socket.on("disconnect", function(player){
		console.log("just quit: "+socket.id);
		idToNick.delete(socket.id);
		socket.broadcast.emit("playerList", Array.from(idToNick));
	});
	socket.on("doThing", function(msg){
		socket.broadcast.emit("selectedPos", msg);
	});
	socket.on("clear", function(msg){
		socket.broadcast.emit("clear", "clear");
	});
	socket.on("hello", function(msg){
		idToNick.set(msg.id, msg.nick);
		if(idToId.length < 2){
			idToId.push(msg.id);
			socket.broadcast.emit("playerList", Array.from(idToNick));
		}
	});
});

http.listen(PORT, function(){
	console.log("Server listen on port: "+PORT);
});
