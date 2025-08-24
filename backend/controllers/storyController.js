const Story = require('../models/Story');

const getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("user", "name description");
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getPersonalStories = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stories = await Story.find({
      $or: [
        { user: userId },
        { "appendedBy.user": userId }
      ]
    }).populate("user", "name description")
      .populate("appendedBy.user", "name");

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching personal stories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getStories, getPersonalStories };