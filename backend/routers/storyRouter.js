const express = require('express');
const router = express.Router();

const { getStories, getPersonalStories, getFilteredStories } = require('../controllers/storyController');

router.get('/stories/filter/:type', getFilteredStories)
router.get('/stories/user/:userId', getPersonalStories);

module.exports = router;