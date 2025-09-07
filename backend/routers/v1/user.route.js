const express = require('express');
const { toggleFollow } = require('../../controllers/v1/user.controller');
const router = express.Router();

router.patch("/users/:currentUserId/follow/:targetUserId", toggleFollow);

module.exports = router;