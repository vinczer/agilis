var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);

var websocket = require('./websocket');
var db = require('./db');
var { listGames } = require('./routes');

websocket.init(http);
db.init();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/games', listGames);

http.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
