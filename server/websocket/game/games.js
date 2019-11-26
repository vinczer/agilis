module.exports = (io, socket, rooms, games) => {
  socket.on('playerStep', function(i, j) {
    let currentGame = games[socket.room];
    let currentPlayerIdx = games[socket.room].playerTurn;
    let currentUserName = Object.keys(currentGame.users)[currentPlayerIdx];
    if (currentUserName !== socket.username) return;
    games[socket.room].playerTurn = 1 - games[socket.room].playerTurn;
    io.in(socket.room).emit('playerStep', currentUserName, i, j);
  });
};
