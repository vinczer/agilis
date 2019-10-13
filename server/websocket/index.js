var initGameEvents = require('./game');

module.exports = {
  init: server => {
    var io = require('socket.io').listen(server);

    initGameEvents(io.of('/game'));
  },
};
