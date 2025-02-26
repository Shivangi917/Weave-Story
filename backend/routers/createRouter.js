const express = require('express');
const router = express.Router();
const { createStory, getStories } = require('../controllers/createController');

router.post('/create', createStory);
router.get('/stories', getStories);

module.exports = router;