const express = require('express');
const router = express.Router();
const { appendContent, appendToAppended, editAppendedContent } = require('../../controllers/v2/append.controller');

router.post('/appendStory', appendContent);
router.post('/append/:appendedId', appendToAppended);
router.post('/stories/:storyId/appended/:appendedId/edit', editAppendedContent);

module.exports = router;