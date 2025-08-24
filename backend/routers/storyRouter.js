const express = require('express');
const router = express.Router();

const { getStories, getPersonalStories } = require('../controllers/storyController');

router.get('/stories', getStories);
router.get('/stories/:userId', getPersonalStories);

module.exports = router;