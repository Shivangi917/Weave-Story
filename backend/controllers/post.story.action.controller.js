const { Content, AppendedContent } = require("../models/Content.model");
const User = require("../models/User.model");
const Notification = require("../models/Notification.model");

const postLike = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId } = req.body;

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = content.likes.indexOf(userId);
    if (index > -1) {
      content.likes.splice(index, 1);
    } else {
      content.likes.push(userId);
    }

    await content.save();
    await content.populate("likes", "_id name");

    console.log(content);
    
    if (content.user.toString() !== userId.toString()) {
      await Notification.create({
        user: content.user,
        actor: userId,
        content: contentId,
        type: "like",
        message: `${user.name} liked your content ${content.content}.`,
      });
    }

    res.json({ likes: content.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const postComment = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId, comment } = req.body;

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    content.comments.push({ user: userId, comment });
    await content.save();
    await content.populate("comments.user", "_id name");

    if (content.user.toString() !== userId.toString()) {
      await Notification.create({
        user: content.user,
        actor: userId,
        content: contentId,
        type: "comment",
        message: `${user.name} commented on your content ${content.content} : ${comment}.`,
      });
    }

    res.json({ comments: content.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const postLikeToAppend = async (req, res) => {
  try {
    const { appendId } = req.params;
    const { userId } = req.body;

    const appended = await AppendedContent.findById(appendId);
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = appended.likes.indexOf(userId);
    if (index > -1) {
      appended.likes.splice(index, 1);
    } else {
      appended.likes.push(userId);
    }

    await appended.save();
    await appended.populate("likes", "_id name");

    if (appended.user.toString() !== userId.toString()) {
      await Notification.create({
        user: appended.user,
        actor: userId,
        appendedContent: appendId,
        type: "like",
        message: `${user.name} liked your content ${appended.content}.`,
      });
    }

    res.json({ likes: appended.likes || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const postCommentToAppend = async (req, res) => {
  try {
    const { appendId } = req.params;
    const { userId, comment } = req.body;

    const appended = await AppendedContent.findById(appendId);
    if (!appended) return res.status(404).json({ message: "Appended content not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    appended.comments.push({ user: userId, comment });
    await appended.save();
    await appended.populate("comments.user", "_id name");

    if (appended.user.toString() !== userId.toString()) {
      await Notification.create({
        user: appended.user,
        actor: userId,
        appendedContent: appendId,
        type: "comment",
        message: `${user.name} commented on your content ${appended.content} : ${comment}.`,
      });
    }

    res.json({ comments: appended.comments || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postLike, postLikeToAppend, postComment, postCommentToAppend };
