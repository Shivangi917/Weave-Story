const mongoose = require("mongoose");
const { Content, AppendedContent } = require("../models/Content.model");
const Notification = require("../models/Notification.model");

// Helpers
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const successResponse = (res, data, message = "Success") =>
  res.status(200).json({ success: true, message, data });

const errorResponse = (res, code, message) =>
  res.status(code).json({ success: false, error: message });

// Create notification
const createNotification = async ({ user, actor, type, contentId, appendedContentId, message }) => {
  if (user.toString() === actor.toString()) return;

  await Notification.create({
    user,
    actor,
    type,
    story: contentId,
    appendedStory: appendedContentId,
    message,
  });
};

// ====== TOP-LEVEL CONTENT ======

// Like a content
const postLikeContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId } = req.body;

    if (!isValidId(contentId) || !isValidId(userId)) 
      return errorResponse(res, 400, "Invalid ID");

    const content = await Content.findById(contentId);
    if (!content) return errorResponse(res, 404, "Content not found");

    const alreadyLiked = content.likes.includes(userId);
    if (alreadyLiked) {
      content.likes = content.likes.filter((id) => id.toString() !== userId);
    } else {
      content.likes.push(userId);
      if (content.user.toString() !== userId) {
        await createNotification({
          user: content.user,
          actor: userId,
          type: "like",
          contentId: content._id,
          message: `Someone liked your content "${content.content}"`,
        });
      }
    }

    await content.save();
    return successResponse(res, { likes: content.likes }, "Like updated");
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// Comment on a content
const postCommentContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId, name, comment } = req.body;

    if (!isValidId(contentId) || !isValidId(userId)) 
      return errorResponse(res, 400, "Invalid ID");

    const content = await Content.findById(contentId);
    if (!content) return errorResponse(res, 404, "Content not found");

    content.comments.push({ user: userId, name, comment });
    await content.save();

    if (content.user.toString() !== userId) {
      await createNotification({
        user: content.user,
        actor: userId,
        type: "comment",
        contentId: content._id,
        message: `${name} commented on your content "${content.content}"`,
      });
    }

    return successResponse(res, { comments: content.comments }, "Comment added");
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// ====== APPENDED CONTENT ======

// Like an appended content
const postLikeAppendedContent = async (req, res) => {
  try {
    const { appendedId } = req.params;
    const { userId } = req.body;

    if (!isValidId(appendedId) || !isValidId(userId)) 
      return errorResponse(res, 400, "Invalid ID");

    const appended = await AppendedContent.findById(appendedId).populate("parentContent");
    if (!appended) return errorResponse(res, 404, "Appended content not found");

    const alreadyLiked = appended.likes.includes(userId);
    if (alreadyLiked) {
      appended.likes = appended.likes.filter((id) => id.toString() !== userId);
    } else {
      appended.likes.push(userId);

      if (appended.user.toString() !== userId) {
        await createNotification({
          user: appended.user,
          actor: userId,
          type: "like",
          contentId: appended.parentContent._id,
          appendedContentId: appended._id,
          message: `Someone liked your appended content "${appended.content}"`,
        });
      }
    }

    await appended.save();
    return successResponse(res, { likes: appended.likes }, "Like updated");
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// Comment on an appended content
const postCommentAppendedContent = async (req, res) => {
  try {
    const { appendedId } = req.params;
    const { userId, name, comment } = req.body;

    if (!isValidId(appendedId) || !isValidId(userId)) 
      return errorResponse(res, 400, "Invalid ID");

    const appended = await AppendedContent.findById(appendedId).populate("parentContent");
    if (!appended) return errorResponse(res, 404, "Appended content not found");

    appended.comments.push({ user: userId, name, comment });
    await appended.save();

    if (appended.user.toString() !== userId) {
      await createNotification({
        user: appended.user,
        actor: userId,
        type: "comment",
        contentId: appended.parentContent._id,
        appendedContentId: appended._id,
        message: `${name} commented on your appended content "${appended.content}"`,
      });
    }

    return successResponse(res, { comments: appended.comments }, "Comment added");
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = {
  postLikeContent,
  postCommentContent,
  postLikeAppendedContent,
  postCommentAppendedContent,
};
