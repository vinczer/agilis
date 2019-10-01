const express = require('express');
const router = express.Router();
const { Player } = require('../models');

router.post('/', async (req, res) => {
    try {
        player = await Player.findById(req.player_id);
        if (player) {
            await player.remove();
            return res.json({ success: true, msg: 'Player logged out!' });
        }
    } catch (e) {
        console.log('Could not log out', e);
    }
    res.json({ success: false, msg: 'Could not log out' });
});


module.exports = router;
