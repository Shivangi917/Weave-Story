const mongoose = require("mongoose");
const Story = require("../../models/v1/Story.model");
const Notification = require("../../models/v1/Notification.model");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const successResponse = (res, data, message = "Success") =>
  res.status(200).json({ success: true, message, data });

const errorResponse = (res, code, message) =>
  res.status(code).json({ success: false, error: message });

const findStory = async (storyId) => {
  if (!isValidId(storyId)) return null;
  return Story.findById(storyId);
};

const findAppended = (story, appendId) => {
  if (!isValidId(appendId)) return null;
  return story.appendedBy.id(appendId);
};

const createNotification = async ({ user, actor, type, story, message }) => {
  if (user.toString() === actor.toString()) return;

  const storyDoc = await Story.findById(story).select("appendedBy.user");
  if (!storyDoc) return;

  const isAppendedUser = storyDoc.appendedBy.some(
    (a) => a.user.toString() === actor.toString()
  );

  if (isAppendedUser) return;

  await Notification.create({ user, actor, type, story, message });
};

const postLike = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId, name } = req.body;

    if (!isValidId(userId)) return errorResponse(res, 400, "Invalid user ID");

    const story = await findStory(storyId);
    if (!story) return errorResponse(res, 404, "Story not found");

    const alreadyLiked = story.likes.some((id) => id.toString() === userId);
    story.likes = alreadyLiked
      ? story.likes.filter((id) => id.toString() !== userId)
      : [...story.likes, userId];

    await story.save();

    if (!alreadyLiked && story.user.toString() !== userId) {
      await createNotification({
        user: story.user,
        actor: userId,
        type: "like",
        story: storyId,
        message: `${name} liked your story "${story.content}"`,
      });
    }

    return successResponse(res, { likes: story.likes }, "Like updated");
  } catch (err) {
    console.error("Error in postLike:", err);
    return errorResponse(res, 500, "Server error");
  }
};

const postComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId, name, comment } = req.body;

    if (!isValidId(userId)) return errorResponse(res, 400, "Invalid user ID");

    const story = await findStory(storyId);
    if (!story) return errorResponse(res, 404, "Story not found");

    story.comments.push({ user: userId, name, comment });
    await story.save();

    if (story.user.toString() !== userId) {
      await createNotification({
        user: story.user,
        actor: userId,
        type: "comment",
        story: storyId,
        message: `${name} commented on your story "${story.content}"`,
      });
    }

    return successResponse(res, { comments: story.comments }, "Comment added");
  } catch (err) {
    console.error("Error in postComment:", err);
    return errorResponse(res, 500, "Server error");
  }
};

const getLike = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId).populate("likes", "name");
    if (!story) return errorResponse(res, 404, "Story not found");
    return successResponse(res, { likes: story.likes });
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const getComment = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId).populate("comments.user", "name");
    if (!story) return errorResponse(res, 404, "Story not found");
    return successResponse(res, { comments: story.comments });
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const postLikeToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const { userId, name } = req.body;

    if (!isValidId(userId)) return errorResponse(res, 400, "Invalid user ID");

    const story = await findStory(storyId);
    if (!story) return errorResponse(res, 404, "Story not found");

    const appended = findAppended(story, appendId);
    if (!appended) return errorResponse(res, 404, "Appended story not found");

    const alreadyLiked = appended.likes.some((id) => id.toString() === userId);
    appended.likes = alreadyLiked
      ? appended.likes.filter((id) => id.toString() !== userId)
      : [...appended.likes, userId];

    await story.save();

    if (!alreadyLiked && appended.user.toString() !== userId) {
      await createNotification({
        user: appended.user,
        actor: userId,
        type: "like",
        story: storyId,
        message: `${name} liked your appended story segment in "${story.content}"`,
      });
    }

    return successResponse(res, { likes: appended.likes }, "Like updated");
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const postCommentToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const { userId, name, comment } = req.body;

    if (!isValidId(userId)) return errorResponse(res, 400, "Invalid user ID");

    const story = await findStory(storyId);
    if (!story) return errorResponse(res, 404, "Story not found");

    const appended = findAppended(story, appendId);
    if (!appended) return errorResponse(res, 404, "Appended story not found");

    appended.comments.push({ user: userId, name, comment });
    await story.save();

    if (appended.user.toString() !== userId) {
      await createNotification({
        user: appended.user,
        actor: userId,
        type: "comment",
        story: storyId,
        message: `${name} commented on your appended story segment in "${story.content}"`,
      });
    }

    return successResponse(res, { comments: appended.comments }, "Comment added");
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const getLikeToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const story = await Story.findById(storyId)
      .populate("appendedBy.likes", "name");
    if (!story) return errorResponse(res, 404, "Story not found");

    const appended = findAppended(story, appendId);
    if (!appended) return errorResponse(res, 404, "Appended story not found");

    return successResponse(res, { likes: appended.likes });
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

const getCommentToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const story = await Story.findById(storyId).populate("appendedBy.comments.user", "name");
    if (!story) return errorResponse(res, 404, "Story not found");

    const appended = findAppended(story, appendId);
    if (!appended) return errorResponse(res, 404, "Appended story not found");

    return successResponse(res, { comments: appended.comments });
  } catch (err) {
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = {
  postLike,
  postComment,
  getLike,
  getComment,
  postLikeToAppendedStory,
  postCommentToAppendedStory,
  getLikeToAppendedStory,
  getCommentToAppendedStory,
};
