const mongoose = require('mongoose');
const Story = require('../models/Story.model');
const Notification = require('../models/Notification.model');

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

const editAppendedStory = async (req, res) => {
  try {
    const { storyId, appendedId } = req.params;
    const { userId, story: newStoryText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storyId) || !mongoose.Types.ObjectId.isValid(appendedId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    if (!newStoryText?.trim() || !userId?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const storyDoc = await Story.findById(storyId);
    if (!storyDoc) return res.status(404).json({ message: "Story not found." });

    const appendedSegment = storyDoc.appendedBy.id(appendedId);
    if (!appendedSegment) return res.status(404).json({ message: "Appended story not found." });

    if (appendedSegment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this segment." });
    }

    appendedSegment.story = newStoryText;
    await storyDoc.save();

    res.status(200).json({ message: "Appended story edited successfully!", updatedStory: storyDoc });

  } catch (error) {
    console.error("Error editing appended story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addStory, editAppendedStory };
