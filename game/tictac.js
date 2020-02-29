console.log("tictac");
let tictacSocket = io();

function hello(){
  let nick = document.getElementById("nick").value;
  if(nick.trim() == ""){return;}
  tictacSocket.emit("hello", {nick: nick, id: tictacSocket.id});
}

tictacSocket.on("loginInfo", function(msg){
  console.log("login info: "+msg);
  if(msg == false){
    alert("Too much players bitch! Just watch!");
  }else{
    document.getElementById("linfo").innerHTML="<p style=\"color:green\">Now you can play!</p>"
    login();
  }

});

tictacSocket.on("playerList", function(idToNick){
  console.log("actualUsers: "+idToNick);
  console.log("some loged out");
  let playerList = document.getElementById("playerList");
  let list = "";
  new Map(idToNick).forEach((value, key) => {
    if(key == tictacSocket.id){return;}
    if(value == undefined){return;}
    list += "<p id\"playerLabel\">You play with "+value+"</p>";
  });
  playerList.innerHTML = list;
});
