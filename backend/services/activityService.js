const Story = require('../models/Story');

const mapLikes = (likes, story, userId, userLiked = false, userCommented = false) =>
  likes
    .filter(liker => liker._id.toString() !== userId.toString())
    .map(liker => ({
      type: 'like',
      actor: { id: liker._id, name: liker.name },
      post: { id: story._id, title: story.story, authorId: story.user },
      userLiked,
      userCommented,
      createdAt: story.updatedAt
    }));

const mapComments = (comments, story, userId, userLiked = false, userCommented = false) =>
  comments
    .filter(comment => comment.user.toString() !== userId.toString())
    .map(comment => ({
      type: 'comment',
      actor: { id: comment.user, name: comment.name },
      post: { id: story._id, title: story.story, authorId: story.user },
      userLiked,
      userCommented,
      createdAt: comment.createdAt
    }));

const getActivities = async (userId, limit = 50) => {
  try {
    let activities = [];

    const userStories = await Story.find({ user: userId })
      .select('story likes comments appendedBy updatedAt user')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .populate('appendedBy.user', 'name')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    userStories.forEach(story => {
      activities.push(...mapLikes(story.likes, story, userId));
      activities.push(...mapComments(story.comments, story, userId));

      story.appendedBy.forEach(append => {
        activities.push(...mapLikes(append.likes, append, userId));
        activities.push(...mapComments(append.comments, append, userId));
      });
    });

    const otherStories = await Story.find({ user: { $ne: userId } })
      .select('story likes comments appendedBy updatedAt user')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .populate('appendedBy.user', 'name')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    otherStories.forEach(story => {
      const userLiked = story.likes.some(u => u._id.toString() === userId.toString());
      const userCommented = story.comments.some(c => c.user._id.toString() === userId.toString());

      if (userLiked || userCommented) {
        activities.push(...mapLikes(story.likes, story, userId, userLiked, userCommented));
        activities.push(...mapComments(story.comments, story, userId, userLiked, userCommented));
      }

      story.appendedBy.forEach(append => {
        const appendUserLiked = append.likes.some(u => u._id.toString() === userId.toString());
        const appendUserCommented = append.comments.some(c => c.user.toString() === userId.toString());

        if (appendUserLiked || appendUserCommented) {
          activities.push(...mapLikes(append.likes, append, userId, appendUserLiked, appendUserCommented));
          activities.push(...mapComments(append.comments, append, userId, appendUserLiked, appendUserCommented));
        }
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return activities;
  } catch (err) {
    console.error('Error fetching activities:', err);
    return [];
  }
};

module.exports = { getActivities };
