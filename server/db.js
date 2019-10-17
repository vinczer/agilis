var mongoose = require('mongoose');

const { Game } = require('./models');

module.exports = {
  init: async () => {
    mongoose
      .connect('mongodb://localhost/agile', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB.'))
      .catch(err => console.error('Could not connect to MongoDB.', err));

    await Game.deleteMany({});

    new Game({ name: 'Amoba', type: 'amoba' }).save(err => console.log);
  },
};
