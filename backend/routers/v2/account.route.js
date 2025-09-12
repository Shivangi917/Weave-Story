const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../../controllers/v2/profile.controller');

router.get('/users/:userId', getUserInfo);

module.exports = router;