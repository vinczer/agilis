var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const { list_games, list_lobbies } = require('../routes/home');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/games', list_games);
app.use('/api/lobbies', list_lobbies);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/")
});

mongoose.connect('mongodb://localhost/agile', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB.'))
    /*  
        add new game to db
        
        const { Game } = require('./models');
        const newGameAmoba = new Game({ name: "Amoba" });
        await newGameAmoba.save();
    */
    .catch(err => console.error('Could not connect to MongoDB.', err));
