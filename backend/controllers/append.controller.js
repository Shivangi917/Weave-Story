const mongoose = require('mongoose');
const { Content, AppendedContent } = require('../models/Content.model');
const Notification = require('../models/Notification.model');

const append = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { userId, content, color, type } = req.body;

    if (!parentId?.trim() || !userId?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(parentId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    let parent;
    if (type === "content") {
      parent = await Content.findById(parentId).lean();
    } else if (type === "append") {
      parent = await AppendedContent.findById(parentId).lean();
    }

    if (!parent) return res.status(404).json({ message: "Parent not found." });

    const newAppendedContent = await AppendedContent.create({
      [type === "content" ? "parentContent" : "parentAppend"]: parentId,
      user: userId,
      content,
      color,
      parentContentOwner: type === "content" ? parent.user : parent.parentContentOwner,
      parentAppendOwner: type === "append" ? parent.user : parent.parentAppendOwner
    });

    if (parent.user.toString() !== userId.toString()) {
      await Notification.create({
        user: parent.user,
        actor: userId,
        type: "append",
        story: type === "content" ? parentId : parent.parentContent, 
        appendedStory: newAppendedContent._id,
        message: `A user appended "${content}" to your ${type}.`,
      });
    }

    res.status(200).json({
      message: "Content appended successfully!",
      newAppendedContent
    });

  } catch (error) {
    console.error("Error appending:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAppend = async (req, res) => {
  try {
    const { appendId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appendId)) {
      return res.status(400).json({ message: "Invalid append ID" });
    }

    const append = await AppendedContent.findById(appendId);
    if (!append) return res.status(404).json({ message: "Append not found" });

    if (append.locked) {
      if (append.user.toString() !== userId) {
        return res.status(403).json({ message: "Cannot delete locked append" });
      }

      append.anonymized = !append.anonymized;
      await append.save();
      return res.status(200).json({ message: "You have removed yourself from this append" });
    }

    if (append.anonymized) {
      append.anonymized = false;
      await append.save();
    }

    let originalContentOwner = null;
    if (append.parentContent) {
      const parentContent = await Content.findById(append.parentContent);
      originalContentOwner = parentContent?.user?.toString();
    }

    const appendUserId = append.user?.toString();
    const canDelete = appendUserId === userId || originalContentOwner === userId;

    if (!canDelete) {
      return res.status(403).json({ message: "Not authorized to delete this append" });
    }

    const deleteNested = async (parentId) => {
      const nested = await AppendedContent.find({ parentAppend: parentId });
      for (let n of nested) {
        await deleteNested(n._id);
      }
      await AppendedContent.deleteOne({ _id: parentId });
    };

    await deleteNested(appendId);

    res.status(200).json({ message: "Append and all nested appends deleted" });

  } catch (err) {
    console.error("Error deleting append:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const lockAppend = async (req, res) => {
  try {
    const { appendId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appendId)) {
      return res.status(400).json({ message: "Invalid append ID" });
    }

    const append = await AppendedContent.findById(appendId)
      .populate('parentContent', 'user')
      .populate('parentAppend', 'user parentContentOwner parentAppendOwner');

    if (!append) return res.status(404).json({ message: "Append not found" });

    let originalContentOwner = null;
    if (append.parentContent) {
      originalContentOwner = append.parentContent.user?.toString();
    } else if (append.parentAppend) {
      let current = append;
      while (current.parentAppend) {
        const parent = await AppendedContent.findById(current.parentAppend)
          .populate('parentContent', 'user')
          .populate('parentAppend', 'user');
        if (!parent) break;
        current = parent;
      }
      if (current.parentContent) originalContentOwner = current.parentContent.user?.toString();
    }

    const isAuthorized = 
      append.user?.toString() === userId ||
      originalContentOwner === userId ||
      append.parentAppend?.user?.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to lock/unlock" });
    }

    append.locked = !append.locked;
    await append.save();

    res.status(200).json({ 
      message: append.locked ? "Locked" : "Unlocked",
      locked: append.locked
    });

  } catch (err) {
    console.error("Error locking/unlocking append:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { append, deleteAppend, lockAppend };
