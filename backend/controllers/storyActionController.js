const Story = require('../models/Story');

const postLike = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked = story.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      story.likes = story.likes.filter(id => id.toString() !== userId);
    } else {
      story.likes.push(userId);
    }

    await story.save();
    res.json({ likes: story.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId, name, comment } = req.body;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    story.comments.push({ user: userId, name, comment });
    await story.save();

    res.json({ comments: story.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLike = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId).populate("likes", "name");
    if (!story) return res.status(404).json({ message: "Story not found" });

    res.json({ likes: story.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId).populate("comments.user", "name");
    if (!story) return res.status(404).json({ message: "Story not found" });

    res.json({ comments: story.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const postLikeToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    const appended = story.appendedBy.id(appendId);
    if (!appended) return res.status(404).json({ error: "Appended story not found" });

    const alreadyLiked = appended.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      appended.likes = appended.likes.filter(id => id.toString() !== userId);
    } else {
      appended.likes.push(userId);
    }

    await story.save();
    res.json({ likes: appended.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postCommentToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const { userId, name, comment } = req.body;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    const appended = story.appendedBy.id(appendId);
    if (!appended) return res.status(404).json({ error: "Appended story not found" });

    appended.comments.push({ user: userId, name, comment });
    await story.save();

    res.json({ comments: appended.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLikeToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const story = await Story.findById(storyId).populate("appendedBy.user", "name");
    if (!story) return res.status(404).json({ error: "Story not found" });

    const appended = story.appendedBy.id(appendId);
    if (!appended) return res.status(404).json({ error: "Appended story not found" });

    res.json({ likes: appended.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCommentToAppendedStory = async (req, res) => {
  try {
    const { storyId, appendId } = req.params;
    const story = await Story.findById(storyId).populate("appendedBy.comments.user", "name");
    if (!story) return res.status(404).json({ error: "Story not found" });

    const appended = story.appendedBy.id(appendId);
    if (!appended) return res.status(404).json({ error: "Appended story not found" });

    res.json({ comments: appended.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  getCommentToAppendedStory
};
