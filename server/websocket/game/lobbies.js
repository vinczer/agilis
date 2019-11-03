const { Game } = require('../../models');

let filterRooms = (game_type, rooms) => {
  console.log('filterRooms', game_type);
  let type_rooms = {};
  for (let key in rooms) {
    if (rooms[key].game_type === game_type) type_rooms[key] = rooms[key];
  }
  console.log('type_rooms', type_rooms);
  return type_rooms;
};

let broadcastRoomList = async (io, rooms) => {
  let game_types = await Game.find().distinct('type');
  console.log('game_types', game_types);
  for (let i in game_types) {
    console.log(`list ${game_types[i]} lobbies`);
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
      creator: username,
      game_type,
      users: {
        [`${username}`]: {
          name: username,
        },
      },
    };
    broadcastRoomList(io, rooms);
    console.log('New room: ' + socket.room + ', Created by: ' + username);
    socket.emit('roomCreated', { username, room: socket.room });
  });

  socket.on('listLobbies', function(game_type) {
    console.log('listLobbies', game_type);
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
        console.log('user escists');
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
      games[room].playerTurn = Math.ceil(Math.random() * 2) - 1;
      delete rooms[room];
      broadcastRoomList(io, rooms);
      socket.emit('joinRoomSuccess', username, room);
      io.in(room).emit('gameStarted', Object.keys(games[room].users)[games[room].playerTurn]);
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
