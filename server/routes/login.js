const express = require('express');
const router = express.Router();
const { Player } = require('../models');

router.post('/', async (req, res) => {
  var name = req.body.username;
  if (!name) {
    return res.json({ success: false, msg: 'Please enter Username!' });
  }
  try {
    player = await Player.findOne({ name: name });
    if (player) {
      return res.json({ success: false, msg: 'Player already exists!' });
    }
    player = new Player({ name });
    await player.save();
    return res.json({ success: true, id: player._id, msg: 'Player added to database!' });
  } catch (e) {
    console.log('Could not save to DB', e);
  }
  res.json({ success: false, msg: 'Could not save to DB' });
});

module.exports = router;
