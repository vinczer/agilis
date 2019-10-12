var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(3001);

module.exports = {
    game: require('./game')(io.of('/game')),
};
  