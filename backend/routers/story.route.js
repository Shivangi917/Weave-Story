const express = require('express');
const router = express.Router();

const { getPersonalStories, getFilteredStories } = require('../controllers/story.controller');

router.get('/filter', getFilteredStories)
router.get('/user/:userId', getPersonalStories);

module.exports = router;