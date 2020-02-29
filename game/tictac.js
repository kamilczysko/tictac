console.log("tictac");
let tictacSocket = io();

function hello(){
  let nick = document.getElementById("nick").value;
  if(nick.trim() == ""){return;}
  tictacSocket.emit("hello", {nick: nick, id: tictacSocket.id});
  login();
}

tictacSocket.on("playerList", function(idToNick){
  console.log("actualUsers: "+idToNick);
  let playerList = document.getElementById("playerList");
  let list = "";
  new Map(idToNick).forEach((value, key) => {
    if(key == tictacSocket.id){return;}
    list += "<p id\"playerLabel\">You play with "+value+"</p>";
  });
  playerList.innerHTML = list;
});
