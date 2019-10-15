let rooms = {};

module.exports = function(gameSocket) {
  gameSocket.on('connection', function(socket) {
    gameSocket.emit('updateRoomList', rooms);

    // events:
    socket.on('createRoom', function(username, room) {
      socket.username = username;
      socket.room = room;

      socket.join(room);

      rooms[room] = {
        name: room,
        users: [
          {
            name: username,
          },
        ],
      };

      gameSocket.emit('updateRoomList', rooms);

      console.log('New room: ' + room + ', Created by: ' + username);
    });

    socket.on('joinRoom', function(username, room) {
      if (room in rooms) {
        socket.username = username;
        socket.room = room;

        socket.join(room);

        rooms[room].users.push({ name: username });

        gameSocket.emit('updateRoomList', rooms);

        console.log(username + ' has connected to ' + room);
      } else {
        console.log('Room not found: ' + room);
      }
    });

    socket.on('disconnect', function() {
      if (socket.room !== undefined) {
        delete rooms[socket.room];
        gameSocket.emit('updateRoomList', rooms);
        console.log('Room deleted: ' + socket.room);
      }
   });
  });
};
