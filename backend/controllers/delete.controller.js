const mongoose = require('mongoose');
const { Content, AppendedContent } = require('../models/Content.model');
const Notification = require('../models/Notification.model');

const deleteContent = async (req, res) => {
  try {
    const { contentId, appendedId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Delete top-level Content
    if (contentId && !appendedId) {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({ message: "Invalid content ID." });
      }

      const content = await Content.findById(contentId);
      if (!content) return res.status(404).json({ message: "Content not found." });

      if (content.user.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this content." });
      }

      // Delete all appended contents related to this content (top-level)
      const topAppends = await AppendedContent.find({ parentContent: contentId }).select('_id');
      const topAppendIds = topAppends.map(a => a._id);

      // Delete nested appends
      await AppendedContent.deleteMany({ parentAppend: { $in: topAppendIds } });

      // Delete top-level appends
      await AppendedContent.deleteMany({ parentContent: contentId });

      await content.deleteOne();
      return res.status(200).json({ message: "Content deleted successfully!" });
    }

    if (appendedId) {
      if (!mongoose.Types.ObjectId.isValid(appendedId)) {
        return res.status(400).json({ message: "Invalid appended content ID." });
      }

      const appended = await AppendedContent.findById(appendedId);
      if (!appended) return res.status(404).json({ message: "Appended content not found." });

      if (appended.user.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this appended content." });
      }

      if (appended.locked) {
        return res.status(400).json({ 
          message: "Locked appended content cannot be deleted.",
          locked: true
        });
      }

      await appended.deleteOne();
      return res.status(200).json({ message: "Appended content deleted successfully!" });
    }

    res.status(400).json({ message: "Provide either contentId or appendedId to delete." });

  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const lockAppendedContent = async (req, res) => {
  try {
    const { appendedId, lock, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appendedId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const appended = await AppendedContent.findById(appendedId).populate('parentContent');
    if (!appended) return res.status(404).json({ message: "Appended content not found." });

    // Only the original Content owner can lock/unlock
    if (appended.parentContent.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to lock/unlock this content." });
    }

    // Recursive function to lock/unlock nested appends
    const lockNestedAppends = async (parentId, lockState) => {
      const nested = await AppendedContent.find({ parentAppend: parentId });
      for (let n of nested) {
        n.locked = lockState;
        await n.save();
        await lockNestedAppends(n._id, lockState); // recurse further
      }
    };

    // Lock/unlock the main appended content
    appended.locked = !!lock;
    await appended.save();

    // Lock/unlock all nested appended content
    await lockNestedAppends(appended._id, !!lock);

    // Notify appended content owner (if not the actor)
    if (appended.user.toString() !== userId) {
      await Notification.create({
        user: appended.user,
        actor: userId,
        type: "lock",
        story: appended.parentContent._id,
        appendedStory: appended._id,
        message: `Your appended content "${appended.content}" and all nested appends were ${lock ? "locked" : "unlocked"} by the author.`,
      });
    }

    res.status(200).json({
      message: `Appended content and nested appends ${lock ? "locked" : "unlocked"} successfully.`,
      updatedContent: appended
    });

  } catch (error) {
    console.error("Error locking appended content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteContent, lockAppendedContent };
