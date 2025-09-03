const express = require('express');
const router = express.Router();
const { createStory } = require('../controllers/create.controller');

router.post('/create', createStory);

module.exports = router;