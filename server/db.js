var mongoose = require('mongoose');

const { Game } = require('./models');

let addAmoba = async () => {
  try {
    games = await Game.find({ name: 'Amoba' });
    if (games.length > 0) return;

    const newGameAmoba = new Game({ name: 'Amoba' });
    await newGameAmoba.save(err => console.log);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  init: async () => {
    mongoose
      .connect('mongodb://localhost/agile', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB.'))
      .catch(err => console.error('Could not connect to MongoDB.', err));

    addAmoba();
  },
};
