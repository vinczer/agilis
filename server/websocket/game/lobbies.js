const { Game } = require('../../models');

let filterRooms = (game_type, rooms) => {
  let type_rooms = {};
  for (let key in rooms) {
    if (rooms[key].game_type == game_type) type_rooms[key] = rooms[key];
  }
  return type_rooms;
};

let broadcastRoomList = async (io, rooms) => {
  let game_types = await Game.find().distinct('type');
  for (let i in game_types) {
    io.in(`${game_types[i]}_lobbies`).emit('updateRoomList', filterRooms(game_types[i], rooms));
  }
};

module.exports = (io, socket, rooms, games) => {
  socket.on('createRoom', function(username, game_type) {
    socket.username = username;
    socket.room = `${game_type}_${Date.now()}`;

    socket.join(socket.room);

    rooms[socket.room] = {
      name: socket.room,
      game_type,
      users: {
        [`${username}`]: {
          name: username,
        },
      },
    };
    broadcastRoomList(io, rooms);
    console.log('New room: ' + socket.room + ', Created by: ' + username);
    socket.emit('roomCreated', socket.room);
  });

  socket.on('listLobbies', function(game_type) {
    socket.listLobbyType = game_type;
    socket.join(`${game_type}_lobbies`);
    socket.emit('updateRoomList', filterRooms(game_type, rooms));
  });

  socket.on('stopListingLobbies', function() {
    socket.leave(`${socket.listLobbyType}_lobbies`);
  });

  socket.on('joinRoom', function(username, room) {
    if (room in rooms) {
      if (username in rooms[room].users) {
        socket.emit('joinRoomFailed', username);
        return;
      }

      socket.username = username;
      socket.room = room;

      rooms[room].users[username] = {
        name: username,
      };

      socket.leave(`${socket.listLobbyType}_lobbies`);
      socket.join(room);
      games[room] = rooms[room];
      delete rooms[room];
      broadcastRoomList(io, rooms);
      socket.emit('joinRoomSuccess', username);
      console.log(username + ' has connected to ' + room);
    } else {
      console.log('Room not found: ' + room);
    }
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
    if (!rooms[socket.room]) return;
    delete rooms[socket.room].users[socket.username];
    if (socket.room in rooms && Object.keys(rooms[socket.room].users).length < 1) {
      delete rooms[socket.room];
    }
    broadcastRoomList(io, rooms);
  });
};
