const express = require('express');
const router = express.Router();
const { deleteStory } = require('../controllers/deleteController');

router.post('/deleteStory', deleteStory);

module.exports = router;