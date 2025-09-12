const express = require('express');
const router = express.Router();
const { deleteContent, lockAppendedContent } = require('../../controllers/v2/delete.controller');

router.post('/deleteStory', deleteContent);
router.post('/appendedStory/lock', lockAppendedContent);

module.exports = router;