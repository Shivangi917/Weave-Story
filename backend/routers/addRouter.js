const express = require('express');
const router = express.Router();
const { addStory } = require('../controllers/addController');

router.post('/appendStory', addStory);

module.exports = router;