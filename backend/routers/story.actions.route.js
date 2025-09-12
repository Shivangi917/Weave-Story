const express = require('express');
const {
  postLikeContent,
  postCommentContent,
  postLikeAppendedContent,
  postCommentAppendedContent
} = require('../controllers/post.story.action.controller');

const {
  getLikesContent,
  getCommentsContent,
  getLikesAppendedContent,
  getCommentsAppendedContent
} = require('../controllers/get.story.action.controller');

const router = express.Router();

router.post('/stories/:storyId/like', postLikeContent);
router.post('/stories/:storyId/comment', postCommentContent);

router.get('/stories/:storyId/like', getLikesContent);
router.get('/stories/:storyId/comment', getCommentsContent);


router.post('/stories/:storyId/appended/:appendId/like', postLikeAppendedContent);
router.post('/stories/:storyId/appended/:appendId/comment', postCommentAppendedContent);

router.get('/stories/:storyId/appended/:appendId/like', getLikesAppendedContent);
router.get('/stories/:storyId/appended/:appendId/comment', getCommentsAppendedContent);

module.exports = router;
