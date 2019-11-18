var initLobbyEvents = require('./lobbies');
var initGameEvents = require('./games');

let rooms = {};
let games = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('user connected');

    initLobbyEvents(io, socket, rooms, games);

    initGameEvents(io, socket, rooms, games);
  });
};
