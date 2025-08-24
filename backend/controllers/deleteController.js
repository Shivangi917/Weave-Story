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
    
    story.appendedBy.splice(appendedIndex, 1);
    await story.save();
    
    res.status(200).json({ message: "Appended story deleted successfully!", updatedStory: story });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteStory };