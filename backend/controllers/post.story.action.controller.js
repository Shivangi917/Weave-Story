const { Content, AppendedContent } = require("../models/Content.model");

// ---- Like Main Content ----
const postLike = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId } = req.body;

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const index = content.likes.indexOf(userId);
    if (index > -1) {
      content.likes.splice(index, 1);
    } else {
      content.likes.push(userId);
    }

    await content.save();
    await content.populate("likes", "_id name");
    res.json({ likes: content.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Comment Main Content ----
const postComment = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId, comment } = req.body;

    console.log(req.params);
    console.log(req.body);

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    content.comments.push({ user: userId, comment });
    await content.save();
    await content.populate("comments.user", "_id name");

    res.json({ comments: content.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Like Appended Content ----
const postLikeToAppend = async (req, res) => {
  try {
    const { appendId } = req.params;
    const { userId } = req.body;

    const appended = await AppendedContent.findById(appendId);
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    const index = appended.likes.indexOf(userId);
    if (index > -1) {
      appended.likes.splice(index, 1);
    } else {
      appended.likes.push(userId);
    }

    await appended.save();
    await appended.populate("likes", "_id name");
    res.json({ likes: appended.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Comment Appended Content ----
const postCommentToAppend = async (req, res) => {
  try {
    const { appendId } = req.params;
    const { userId, comment } = req.body;

    const appended = await AppendedContent.findById(appendId);
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    appended.comments.push({ user: userId, comment });
    await appended.save();
    await appended.populate("comments.user", "_id name");

    res.json({ comments: appended.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postLike, postLikeToAppend, postComment, postCommentToAppend };
