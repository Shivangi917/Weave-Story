const express = require('express');
const router = express.Router();
const { createStory } = require('../controllers/createController');

router.post('/create', createStory);

module.exports = router;