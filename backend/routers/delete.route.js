const express = require('express');
const router = express.Router();
const { deleteStory, lockStory } = require('../controllers/delete.controller');

router.post('/deleteStory', deleteStory);
router.post('/appendedStory/lock', lockStory);

module.exports = router;