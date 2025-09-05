const Story = require('../models/Story.model');
const mongoose = require('mongoose');
const Notification = require('../models/Notification.model');

const deleteStory = async (req, res) => {
  try {
    const { storyId, appendedIndex, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storyId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found." });

    if (appendedIndex === undefined || appendedIndex === null) {
      if (story.user.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this story." });
      }

      await story.deleteOne();
      return res.status(200).json({ message: "Story deleted successfully!" });
    }
    
    if (appendedIndex < 0 || appendedIndex >= story.appendedBy.length) {
      return res.status(400).json({ message: "Invalid appended story index." });
    }
    
    const appendedSegment = story.appendedBy[appendedIndex];

    if (story.user.toString() !== userId && appendedSegment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this story segment." });
    }

    if(appendedSegment.locked) {
      return res.status(200).json({ 
        message: "Locked story segment cannot be deleted. Name will be hidden on frontend",
        locked: true
      });
    }
    
    story.appendedBy.splice(appendedIndex, 1);
    await story.save();
  
    res.status(200).json({ message: "Appended story deleted successfully!", updatedStory: story });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const lockStory = async (req, res) => {
  try {
    const { storyId, appendedIndex, lock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ success: false, message: "Invalid story ID." });
    }

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (typeof appendedIndex !== 'number' || !story.appendedBy[appendedIndex]) {
      return res.status(400).json({ success: false, message: "Invalid appended index." });
    }

    const segment = story.appendedBy[appendedIndex];
    segment.locked = !!lock;
    await story.save();

    if (story.user.toString() !== segment.user.toString()) {
      await Notification.create({
        user: segment.user,
        actor: story.user._id,
        type: "lock", 
        story: storyId,
        message: `Your appended story ${segment.content} was ${lock ? "locked" : "unlocked"} by author ${story.user.name}".`,
      });
    }

    res.status(200).json({
      message: `Story segment ${lock ? "locked" : "unlocked"}`,
      updatedStory: story
    });

  } catch (error) {
    console.error("Error locking story segment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteStory, lockStory };