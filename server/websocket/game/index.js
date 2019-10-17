var initLobbyEvents = require('./lobbies');

let rooms = {};
let games = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('user connected');

    initLobbyEvents(io, socket, rooms, games);
  });
};
