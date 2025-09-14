const Notification = require("../models/Notification.model");

const getActivitiesController = async (req, res) => {
  try {
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const activities = await Notification.find({
      $or: [{ user: userId }, { actor: { $ne: userId }}],
    })
      .populate("user", "name")
      .populate("actor", "name")
      .populate("content", "content name")
      .populate("appendedContent", "content")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markSeen = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { seen: true });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { getActivitiesController, markSeen };
