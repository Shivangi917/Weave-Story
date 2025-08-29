const mongoose = require('mongoose');
const Story = require('../models/Story');
const Notification = require('../models/Notification');

const addStory = async (req, res) => {
  try {
    const { storyId, userId, name, story, color } = req.body;

    if (!storyId?.trim() || !userId?.trim() || !name?.trim() || !story?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(storyId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $push: { appendedBy: { user: userId, name, story, color } } },
      { new: true }
    ).lean();

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found." });
    }
    
    if (updatedStory.user.toString() !== userId.toString()) {
      await Notification.create({
        user: updatedStory.user,
        actor: userId,
        type: "append",
        story: storyId,
        message: `${name} appended "${story}" to your story "${updatedStory.story}"`,
      });
    }

    res.status(200).json({ message: "Story appended successfully!", updatedStory });

  } catch (error) {
    console.error("Error adding story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addStory };
