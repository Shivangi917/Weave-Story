const mongoose = require("mongoose");
const { Content, AppendedContent } = require("../models/Content.model");

// Helpers
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const successResponse = (res, data, message = "Success") =>
  res.status(200).json({ success: true, message, data });

const errorResponse = (res, code, message) =>
  res.status(code).json({ success: false, error: message });

// ====== GET Likes and Comments ======

// Get likes for a top-level content
const getLikesContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    if (!isValidId(contentId)) return errorResponse(res, 400, "Invalid content ID");

    const content = await Content.findById(contentId).populate("likes", "name");
    if (!content) return errorResponse(res, 404, "Content not found");

    return successResponse(res, { likes: content.likes });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// Get comments for a top-level content
const getCommentsContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    if (!isValidId(contentId)) return errorResponse(res, 400, "Invalid content ID");

    const content = await Content.findById(contentId).populate("comments.user", "name");
    if (!content) return errorResponse(res, 404, "Content not found");

    return successResponse(res, { comments: content.comments });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// Get likes for an appended content
const getLikesAppendedContent = async (req, res) => {
  try {
    const { appendedId } = req.params;
    if (!isValidId(appendedId)) return errorResponse(res, 400, "Invalid appended content ID");

    const appended = await AppendedContent.findById(appendedId).populate("likes", "name");
    if (!appended) return errorResponse(res, 404, "Appended content not found");

    return successResponse(res, { likes: appended.likes });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

// Get comments for an appended content
const getCommentsAppendedContent = async (req, res) => {
  try {
    const { appendedId } = req.params;
    if (!isValidId(appendedId)) return errorResponse(res, 400, "Invalid appended content ID");

    const appended = await AppendedContent.findById(appendedId).populate("comments.user", "name");
    if (!appended) return errorResponse(res, 404, "Appended content not found");

    return successResponse(res, { comments: appended.comments });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = {
  getLikesContent,
  getCommentsContent,
  getLikesAppendedContent,
  getCommentsAppendedContent,
};
