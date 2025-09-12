const express = require('express');
const {
  postLike,
  postComment,
  postLikeToAppendedStory,
  postCommentToAppendedStory,
  getLike,
  getComment,
  getLikeToAppendedStory,
  getCommentToAppendedStory
} = require('../../controllers/v2/story.action.controller');

const router = express.Router();

router.post('/stories/:storyId/like', postLike);
router.post('/stories/:storyId/comment', postComment);

router.get('/stories/:storyId/like', getLike);
router.get('/stories/:storyId/comment', getComment);


router.post('/stories/:storyId/appended/:appendId/like', postLikeToAppendedStory);
router.post('/stories/:storyId/appended/:appendId/comment', postCommentToAppendedStory);

router.get('/stories/:storyId/appended/:appendId/like', getLikeToAppendedStory);
router.get('/stories/:storyId/appended/:appendId/comment', getCommentToAppendedStory);

module.exports = router;
