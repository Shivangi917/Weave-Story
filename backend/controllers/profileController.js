const User = require('../models/User');

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getUserInfo };