const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/profile.controller');

router.get('/user/:userId', getUserInfo);

module.exports = router;