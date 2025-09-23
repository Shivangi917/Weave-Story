const express = require('express');
const { toggleFollow } = require('../controllers/user.controller');
const router = express.Router();

router.patch("/user/:currentUserId/follow/:targetUserId", toggleFollow);

module.exports = router;