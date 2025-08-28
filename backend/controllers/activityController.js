const { getActivities } = require('../services/activityService');

const getActivitiesController = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const activities = await getActivities(userId);
    return res.json(activities);
  } catch (err) {
    console.error('Controller error:', err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getActivitiesController };
