const express = require('express');
const router = express.Router();
const { createStory } = require('../../controllers/v2/create.controller');

router.post('/create', createStory);

module.exports = router;