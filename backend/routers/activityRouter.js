const express = require('express');
const router = express.Router();
const { getActivitiesController } = require('../controllers/activityController');

router.get('/activity', getActivitiesController);

module.exports = router;
