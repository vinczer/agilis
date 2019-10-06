const { Player } = require('../models/home');

module.exports = async (req, res, next) => {
    try {
        const id = req.headers.id;
        if (id) {
            player = await Player.findById(id);
            if (player) {
                req.player_id = id;
                return next();
            }
        }
    } catch (e) {
        console.log(e);
    }
    res.json({ success: false, msg: "Unauthorized" });
}
