const express = require('express');
const router = express.Router();
const { append, editAppendedContent } = require('../controllers/append.controller');

router.post('/:parentId', append);
router.post('/stories/:storyId/appended/:appendedId/edit', editAppendedContent);

module.exports = router;