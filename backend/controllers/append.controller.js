const mongoose = require('mongoose');
const { Content, AppendedContent } = require('../models/Content.model');
const Notification = require('../models/Notification.model');

const append = async (req, res) => {
  try {
    const { parentId } = req.params; // could be contentId or appendId
    const { userId, content, color, type } = req.body;

    if (!parentId?.trim() || !userId?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(parentId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    // Decide which model to query
    let parent;
    if (type === "content") {
      parent = await Content.findById(parentId).lean();
    } else if (type === "append") {
      parent = await AppendedContent.findById(parentId).lean();
    }

    if (!parent) return res.status(404).json({ message: "Parent not found." });

    // Create new appended content
    const newAppendedContent = await AppendedContent.create({
      [type === "content" ? "parentContent" : "parentAppend"]: parentId,
      user: userId,
      content,
      color
    });

    // Notifications
    if (parent.user.toString() !== userId.toString()) {
      await Notification.create({
        user: parent.user,
        actor: userId,
        type: "append",
        story: type === "content" ? parentId : parent.parentContent, // track root content
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

const editAppendedContent = async (req, res) => {
  try {
    const { appendedId } = req.params;
    const { userId, content: newContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appendedId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    if (!newContent?.trim()) {
      return res.status(400).json({ message: "Content cannot be empty." });
    }

    const appendedDoc = await AppendedContent.findById(appendedId);
    if (!appendedDoc) return res.status(404).json({ message: "Appended content not found." });

    if (appendedDoc.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to edit this content." });
    }

    appendedDoc.content = newContent;
    await appendedDoc.save();

    res.status(200).json({ message: "Appended content edited successfully!", appendedDoc });

  } catch (error) {
    console.error("Error editing appended content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { append, editAppendedContent };
