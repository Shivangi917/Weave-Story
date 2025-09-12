const express = require('express');
const router = express.Router();
const { createContent } = require('../../controllers/v2/create.controller');

router.post('/create', createContent);

module.exports = router;