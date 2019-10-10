const express = require('express');
const router = express.Router();
const { Game } = require('../models');

router.get('/', async (req, res) => {
  try {
    games = await Game.find({});
    if (games) {
      return res.json({ success: true, games: games.map(g => ({ id: g._id, name: g.name })) });
    }
  } catch (e) {
    console.log('Could not save to DB', e);
  }
  res.json({ success: false, games: [] });
});

module.exports = router;
