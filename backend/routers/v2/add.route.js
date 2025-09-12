const express = require('express');
const router = express.Router();
const { addStory, editAppendedStory } = require('../../controllers/v2/add.controller');

router.post('/appendStory', addStory);
router.post('/stories/:storyId/appended/:appendedId/edit', editAppendedStory);

module.exports = router;