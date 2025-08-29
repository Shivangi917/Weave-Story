const express = require('express');
const router = express.Router();
const { getActivitiesController, markSeen } = require('../controllers/activityController');

router.get('/activity', getActivitiesController);
router.patch('/activity/:notificationId/seen', markSeen)

module.exports = router;
