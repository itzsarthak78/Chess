const socket = io();

const chess = new Chess();

let matchId = window.location.pathname.replace("/", "");

let selectedSquare = null;

let whiteTime = 600;
let blackTime = 600;

let turn = "white";

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

const moveList = document.getElementById("moves");

const capturedWhite = document.getElementById("capturedWhite");
const capturedBlack = document.getElementById("capturedBlack");

const resignBtn = document.getElementById("resignBtn");
const homeBtn = document.getElementById("homeBtn");

socket.emit("join",{matchId});


/* ---------------- BOARD ---------------- */

function createBoard(){

boardElement.innerHTML="";

const files = ["a","b","c","d","e","f","g","h"];

for(let rank=8;rank>=1;rank--){

for(let file=0;file<8;file++){

let square = document.createElement("div");

square.classList.add("square");

let color = ((rank + file) % 2 === 0) ? "light" : "dark";

square.classList.add(color);

let squareId = files[file] + rank;

square.id = squareId;

square.addEventListener("click",squareClick);

boardElement.appendChild(square);

}

}

}


createBoard();



/* ---------------- RENDER BOARD ---------------- */

function renderBoard(){

let board = chess.board();

const files = ["a","b","c","d","e","f","g","h"];

for(let r=0;r<8;r++){

for(let f=0;f<8;f++){

let square = document.getElementById(files[f]+(8-r));

square.innerHTML="";

let piece = board[r][f];

if(piece){

let img = document.createElement("img");

img.draggable=false;

img.className="piece";

img.src="/assets/pieces/"+piece.color+piece.type+".png";

square.appendChild(img);

}

}

}

updateStatus();

}

renderBoard();



/* ---------------- MOVE HANDLING ---------------- */

function squareClick(e){

let square = e.currentTarget.id;

if(selectedSquare == null){

selectedSquare = square;

highlightSquare(square);

return;

}

let move = {

from:selectedSquare,
to:square,
promotion:"q"

};

try{

let result = chess.move(move);

if(result){

socket.emit("move",{matchId,move});

handleMove(result);

}

}catch(err){}

clearHighlights();

selectedSquare=null;

renderBoard();

}



function handleMove(result){

addMove(result.san);

if(result.captured){

addCapture(result.captured,result.color);

}

}



/* ---------------- MOVE HISTORY ---------------- */

function addMove(move){

let li = document.createElement("li");

li.innerText = move;

moveList.appendChild(li);

}



/* ---------------- CAPTURED PIECES ---------------- */

function addCapture(piece,color){

let img = document.createElement("img");

img.className="captured";

img.src="/assets/pieces/"+(color==="w"?"b":"w")+piece+".png";

if(color==="w")
capturedBlack.appendChild(img);
else
capturedWhite.appendChild(img);

}



/* ---------------- HIGHLIGHT ---------------- */

function highlightSquare(id){

document.getElementById(id).style.outline="3px solid yellow";

}

function clearHighlights(){

document.querySelectorAll(".square").forEach(s=>{
s.style.outline="";
});

}



/* ---------------- STATUS ---------------- */

function updateStatus(){

let moveColor = chess.turn() === "w" ? "White" : "Black";

statusText.innerText = moveColor + " to move";

}



/* ---------------- SOCKET EVENTS ---------------- */

socket.on("move",(move)=>{

chess.move(move);

renderBoard();

});


socket.on("gameover",(msg)=>{

document.getElementById("gameResult").innerText = msg;

document.getElementById("gameOverModal").style.display="flex";

});



/* ---------------- RESIGN ---------------- */

resignBtn.addEventListener("click",()=>{

if(confirm("Are you sure you want to resign?")){

socket.emit("resign",{matchId});

}

});



/* ---------------- HOME ---------------- */

homeBtn.addEventListener("click",()=>{

if(confirm("Return to main menu?")){

socket.emit("leaveMatch",{matchId});

window.location.href="/menu.html";

}

});



/* ---------------- TIMERS ---------------- */

function updateTimers(){

if(turn==="white") whiteTime--;
else blackTime--;

document.getElementById("whiteTimer").innerText = formatTime(whiteTime);
document.getElementById("blackTimer").innerText = formatTime(blackTime);

if(whiteTime<=0){

socket.emit("gameover",{matchId,result:"Black wins on time"});

}

if(blackTime<=0){

socket.emit("gameover",{matchId,result:"White wins on time"});

}

}

setInterval(updateTimers,1000);



function formatTime(t){

let m = Math.floor(t/60);
let s = t%60;

return m+":"+(s<10?"0":"")+s;

}



/* ---------------- REMATCH / MENU BUTTONS ---------------- */

document.getElementById("menuBtn").onclick = ()=>{

window.location.href="/menu.html";

};

document.getElementById("rematchBtn").onclick = ()=>{

socket.emit("rematch",{matchId});

};
