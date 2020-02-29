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
	io.to(socket.id).emit("playerList", Array.from(idToNick));
	socket.broadcast.emit("board", this.board);
	console.log("new player: "+socket.id)
	socket.on("disconnect", function(player){
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
		if(idToNick.size < 2){
			idToNick.set(msg.id, msg.nick);
			console.log("login: "+msg.nick);
			io.to(socket.id).emit("loginInfo", true);
			socket.broadcast.emit("playerList", Array.from(idToNick));
			return;
		}else
			io.to(socket.id).emit("loginInfo", false);
	});
});

http.listen(PORT, function(){
	console.log("Server listen on port: "+PORT);
});
