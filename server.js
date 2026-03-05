const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const TelegramBot = require("node-telegram-bot-api")
const { Chess } = require("chess.js")
const { v4: uuidv4 } = require("uuid")

const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("web"))

const PORT = 3000


/* ---------------- DATA ---------------- */

let queue = []
let games = {}


/* ---------------- TELEGRAM BOT ---------------- */

bot.onText(/\/start/, (msg)=>{

bot.sendMessage(msg.chat.id,
`♟ Telegram Chess

Commands

/queue - find opponent
/help - help`)
})


bot.onText(/\/queue/, (msg)=>{

const player = {
id: msg.from.id,
name: msg.from.first_name
}

if(queue.find(p => p.id === player.id)){

bot.sendMessage(msg.chat.id,"You are already in queue.")
return

}

queue.push(player)

bot.sendMessage(msg.chat.id,"Searching for opponent...")

if(queue.length >= 2){

let p1 = queue.shift()
let p2 = queue.shift()

let matchId = uuidv4()

games[matchId] = {
chess: new Chess(),
players: [p1.id,p2.id]
}

let url = `https://YOUR_DOMAIN/game.html?match=${matchId}`

bot.sendMessage(p1.id,
`♟ Match found vs ${p2.name}

Play here:
${url}`)

bot.sendMessage(p2.id,
`♟ Match found vs ${p1.name}

Play here:
${url}`)

}

})


/* ---------------- SOCKET ---------------- */

io.on("connection",(socket)=>{

console.log("Player connected")


socket.on("join",({matchId})=>{

socket.join(matchId)

console.log("Joined match",matchId)

})


/* ---------------- MOVE ---------------- */

socket.on("move",({matchId,move})=>{

let game = games[matchId]

if(!game) return

try{

let result = game.chess.move(move)

if(result){

io.to(matchId).emit("move",move)

if(game.chess.isCheckmate()){

io.to(matchId).emit("gameover","Checkmate")

}

if(game.chess.isDraw()){

io.to(matchId).emit("gameover","Draw")

}

}

}catch(e){}

})


/* ---------------- RESIGN ---------------- */

socket.on("resign",({matchId})=>{

io.to(matchId).emit("gameover","Opponent resigned")

delete games[matchId]

})


/* ---------------- LEAVE ---------------- */

socket.on("leaveMatch",({matchId})=>{

socket.leave(matchId)

})


/* ---------------- REMATCH ---------------- */

socket.on("rematch",({matchId})=>{

games[matchId] = {
chess:new Chess()
}

io.to(matchId).emit("rematch")

})


})


/* ---------------- START SERVER ---------------- */

server.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
