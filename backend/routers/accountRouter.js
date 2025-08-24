const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/profileController');

router.get('/users/:userId', getUserInfo);

module.exports = router;