function resign(){

if(confirm("Are you sure you want to resign?")){

socket.emit("resign",{matchId});

}

}
