const { Content, AppendedContent } = require("../models/Content.model");

// ---- Get Likes for Main Content ----
const getLikesContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId).populate("likes", "_id name");
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json({ likes: content.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Get Comments for Main Content ----
const getCommentsContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId).populate("comments.user", "_id name");
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json({ comments: content.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Likes for Appended Content ----
const getLikesAppendedContent = async (req, res) => {
  try {
    const { appendId } = req.params;
    const appended = await AppendedContent.findById(appendId).populate("likes", "_id name");
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    res.json({ likes: appended.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Comments for Appended Content ----
const getCommentsAppendedContent = async (req, res) => {
  try {
    const { appendId } = req.params;
    const appended = await AppendedContent.findById(appendId).populate("comments.user", "_id name");
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    res.json({ comments: appended.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLikesContent,
  getLikesAppendedContent,
  getCommentsContent,
  getCommentsAppendedContent,
};
