const Story = require('../models/Story');

const deleteStory = async (req, res) => {
  try {
    const { storyId, appendedIndex, userId } = req.body;

    if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid story ID format." });
    }

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found." });

    if (appendedIndex === undefined || appendedIndex === null) {
      if (story.user.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this story." });
      }

      await Story.findByIdAndDelete(storyId);
      return res.status(200).json({ message: "Story deleted successfully!" });
    }
    
    if (appendedIndex < 0 || appendedIndex >= story.appendedBy.length) {
      return res.status(400).json({ message: "Invalid appended story index." });
    }
    
    const appendedSegment = story.appendedBy[appendedIndex];
    if (story.user.toString() !== userId && appendedSegment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this story segment." });
    }

    if(appendedIndex !== null) {
      const appended = story.appendedBy[appendedIndex];
      if(appended.locked) {
        return res.status(200).json({ 
          message: "Locked story segment cannot be deleted. Name will be hidden on frontend",
          locked: true
        });
      } else {
        story.appendedBy.splice(appendedIndex, 1);
        await story.save();
      }
    }
    
    res.status(200).json({ message: "Appended story deleted successfully!", updatedStory: story });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const lockStory = async (req, res) => {
  try {
    const { storyId, appendedIndex, lock } = req.body;
    
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.appendedBy[appendedIndex]) {
      return res.status(400).json({ message: "Invalid appended index" });
    }

    story.appendedBy[appendedIndex].locked = lock;
    await story.save();

    res.status(200).json({ message: `Story segment ${lock ? "locked" : "unlocked"}` });
  } catch (error) {
    console.error("Error locking story segment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteStory, lockStory };