const express = require("express");
const {
  postLike,
  postLikeToAppend,
  postComment,
  postCommentToAppend,
} = require("../controllers/post.story.action.controller");

const {
  getLikesContent,
  getLikesAppendedContent,
  getCommentsContent,
  getCommentsAppendedContent,
} = require("../controllers/get.story.action.controller");

const router = express.Router();

// ----- Likes -----
router.post("/content/:contentId/like", postLike);
router.post("/appended/:appendId/like", postLikeToAppend);

// ----- Comments -----
router.post("/content/:contentId/comment", postComment);
router.post("/appended/:appendId/comment", postCommentToAppend);

// ----- Get Likes -----
router.get("/content/:contentId/likes", getLikesContent);
router.get("/appended/:appendId/likes", getLikesAppendedContent);

// ----- Get Comments -----
router.get("/content/:contentId/comments", getCommentsContent);
router.get("/appended/:appendId/comments", getCommentsAppendedContent);

module.exports = router;
