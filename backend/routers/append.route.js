const express = require('express');
const router = express.Router();
const { append, deleteAppend, lockAppend } = require('../controllers/append.controller');

// Append to content or append
router.post('/content/:parentId', append);

// Delete append (or anonymize if locked)
router.post('/delete', deleteAppend);

// Lock/unlock append
router.post('/lock', lockAppend);

module.exports = router;
