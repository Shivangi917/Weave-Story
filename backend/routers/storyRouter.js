const express = require('express');
const router = express.Router();

const { getPersonalStories, getFilteredStories } = require('../controllers/storyController');

router.get('/stories/filter', getFilteredStories)
router.get('/stories/user/:userId', getPersonalStories);

module.exports = router;