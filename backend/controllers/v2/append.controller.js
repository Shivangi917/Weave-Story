const mongoose = require('mongoose');
const { Content, AppendedContent } = require('../../models/v2/Content.model');
const Notification = require('../../models/v2/Notification.model');

const appendContent = async (req, res) => {
  try {
    const { contentId, userId, name, content, color } = req.body;

    if (!contentId?.trim() || !userId?.trim() || !name?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const parentContent = await Content.findById(contentId).lean();
    if (!parentContent) return res.status(404).json({ message: "Content not found." });

    const newAppendedContent = await AppendedContent.create({
      parentContent: contentId,
      user: userId,
      content,
      color
    });

    if (parentContent.user.toString() !== userId.toString()) {
      await Notification.create({
        user: parentContent.user,
        actor: userId,
        type: "append",
        story: contentId,
        appendedStory: newAppendedContent._id,
        message: `${name} appended "${content}" to your story "${parentContent.content}"`,
      });
    }

    res.status(200).json({ message: "Content appended successfully!", newAppendedContent });

  } catch (error) {
    console.error("Error appending content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const appendToAppended = async (req, res) => {
  try {
    const { appendedId, userId, name, content, color } = req.body;

    if (!appendedId?.trim() || !userId?.trim() || !name?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(appendedId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const parentAppend = await AppendedContent.findById(appendedId).lean();
    if (!parentAppend) return res.status(404).json({ message: "Appended content not found." });

    const newNestedAppend = await AppendedContent.create({
      parentAppend: appendedId,
      user: userId,
      content,
      color
    });

    if (parentAppend.user.toString() !== userId.toString()) {
      await Notification.create({
        user: parentAppend.user,
        actor: userId,
        type: "append",
        appendedStory: appendedId,
        message: `${name} appended "${content}" to your appended content`,
      });
    }

    res.status(200).json({ message: "Nested content appended successfully!", newNestedAppend });

  } catch (error) {
    console.error("Error appending to appended content:", error);
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

module.exports = { appendContent, appendToAppended, editAppendedContent };
