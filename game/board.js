let board = [[0,0,0],[0,0,0],[0,0,0]];
let actualChar = "O";
let canPlay = true;
let isLogged = false;
let socket = io();
function cleanScoreAndDrawBoard(){
	board = [[0,0,0],[0,0,0],[0,0,0]];
	cleanScore();
	drawBoard();
	canPlay = true;
	actualChar = "O";
}

function newBegining(){
	socket.emit("clear", "clear");
	cleanScoreAndDrawBoard();
}

function login(){isLogged = true;}
function logout(){isLogged = false;}

function drawBoard(){
	let boardSpace = document.getElementById("board");
	boardSpace.innerHTML = "";
	for(r = 0; r < 3; r++){
		let row = document.createElement('div');
		row.id = "row_"+r;
		row.className = "row";
		for(c = 0; c < 3; c++){
			let cell = document.createElement('div');
			cell.id = r+"_"+c;
			cell.className = "cell";
			cell.addEventListener("click", doThing, false);
			row.appendChild(cell);
		}
		boardSpace.appendChild(row);
	}
}

socket.on("selectedPos", function(msg){
	let row = msg['rowNum'];
	let col = msg['colNum'];
	console.log("other player selection: "+row+", "+col);
	board[row][col] = actualChar;
	drawSign(row+"_"+col);
        let winner = checkBoard();
        if(winner == "O"){
                console.log("O is winner");
                winnerO();
                board = [[0,0,0],[0,0,0],[0,0,0]];
        }
        if(winner == "X"){
                console.log("X is winner");
                winnerX();
                board = [[0,0,0],[0,0,0],[0,0,0]];
        }
        changeSign();

});
socket.on("clear", function(msg){cleanScoreAndDrawBoard()});
function doThing(e){
	console.log("canplay, isLogged: "+canPlay+", "+isLogged);
	console.log("should play: "+!canPlay && !isLogged);
	if(!(canPlay && isLogged)){return;}
	let clickedCell = e.srcElement.id;
	let positionClicked = clickedCell.split("_");
	let row = positionClicked[0];
	let col = positionClicked[1];
	console.log("Selected position: "+positionClicked);
	socket.emit("doThing", {rowNum: row, colNum:col});
	if(board[row][col] != 0){return;}
	drawSign(clickedCell);
	board[row][col] = actualChar;
	console.log("actual board:"+ board);
	let winner = checkBoard();
	if(winner == "O"){
		console.log("O is winner");
		winnerO();
		canPlay=false;
	}
	if(winner == "X"){
		console.log("X is winner");
		winnerX();
		canPlay=false;
	}
	if(winner == "D"){
		draw();
		canPlay = false;
	}
	changeSign();
}

function drawSign(cellId){
	let element = document.getElementById(cellId);
	element.innerHTML = "<b id=\"char\">"+actualChar+"</b>";
}


function changeSign(){
	if(actualChar == "O"){
		actualChar = "X";
	}else{
		actualChar = "O";
	}
}

function checkBoard(){
	for(row = 0; row < board.length; row ++){
		if (board[row].every((val, i , arr )=> val == "X")) return "X";
		if (board[row].every((val, i, arr) => val == "O")) return "O";
	}

	for(col = 0; col < board.length; col ++){//TODO zmiana
		let colToCheck = [];
		for(row = 0; row < board.length; row ++){
			colToCheck.push(board[row][col]);
		}
		console.log("check Column: "+colToCheck);
		if(colToCheck.every((val ,i , arr) => val == "X")) return "X";
		if(colToCheck.every((val, i, arr) => val == "O")) return "O";
	}
	let diagToCheck = [];
	diagToCheck.push(board[0][0]);
	diagToCheck.push(board[2][2]);
	diagToCheck.push(board[1][1]);
	if(diagToCheck.every((val ,i , arr) => val == "X")) return "X";
	if(diagToCheck.every((val ,i , arr) => val == "O")) return "O";
	diagToCheck = [];
	diagToCheck.push(board[2][0]);
	diagToCheck.push(board[1][1]);
	diagToCheck.push(board[0][2]);
	if(diagToCheck.every((val ,i , arr) => val == "X")) return "X";
	if(diagToCheck.every((val ,i , arr) => val == "O")) return "O";
	if(board.flat().every((val, i, arr) => val != 0)) return "D";
	return 0;
}

function winnerX(){
	let winnerLabel = document.getElementById("winner");
	winnerLabel.innerHTML = "<b>X</b> is winner";
}

function winnerO(){
	let winnerLabel = document.getElementById("winner");
	winnerLabel.innerHTML = "<b>O</b> is winner";
}

function draw(){
	let winnerLabel = document.getElementById("winner");
	winnerLabel.innerHTML = "It's draw!!!";
}

function cleanScore(){
	let winnerLabel = document.getElementById("winner");
	winnerLabel.innerHTML="Play!";
}
