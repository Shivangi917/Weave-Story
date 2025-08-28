const Story = require('../models/Story');

const getActivities = async (userId) => {
  try {
    let activities = [];

    const userStories = await Story.find({ user: userId })
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .populate('appendedBy.user', 'name');

    userStories.forEach(story => {
      story.likes.forEach(liker => {
        if (liker._id.toString() !== userId.toString()) {
          activities.push({
            type: 'like',
            actor: { id: liker._id, name: liker.name },
            post: { id: story._id, title: story.story, authorId: story.user },
            createdAt: story.updatedAt
          });
        }
      });

      story.appendedBy.forEach(append => {
        append.likes.forEach(liker => {
          if (liker._id.toString() !== userId.toString()) {
            activities.push({
              type: 'like',
              actor: { id: liker._id, name: liker.name },
              post: { id: append._id, title: append.story, authorId: append.user },
              createdAt: story.updatedAt
            });
          }
        });

        append.comments.forEach(comment => {
          if (comment.user.toString() !== userId.toString()) {
            activities.push({
              type: 'comment',
              actor: { id: comment.user, name: comment.name },
              post: { id: append._id, title: append.story, authorId: append.user },
              createdAt: comment.createdAt
            });
          }
        });
      });
    });

    const otherStories = await Story.find({ user: { $ne: userId } })
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .populate('appendedBy.user', 'name');

    otherStories.forEach(story => {
      const userLiked = story.likes.some(u => u._id.toString() === userId.toString());
      const userCommented = story.comments.some(c => c.user._id.toString() === userId.toString());

      if (userLiked || userCommented) {
        story.likes.forEach(liker => {
          if (liker._id.toString() !== userId.toString()) {
            activities.push({
              type: 'like',
              actor: { id: liker._id, name: liker.name },
              post: { id: story._id, title: story.story, authorId: story.user },
              userLiked,
              userCommented,
              createdAt: story.updatedAt
            });
          }
        });

        story.comments.forEach(comment => {
          if (comment.user._id.toString() !== userId.toString()) {
            activities.push({
              type: 'comment',
              actor: { id: comment.user._id, name: comment.name },
              post: { id: story._id, title: story.story, authorId: story.user },
              userLiked,
              userCommented,
              createdAt: comment.createdAt
            });
          }
        });
      }

      story.appendedBy.forEach(append => {
        const appendUserLiked = append.likes.some(u => u._id.toString() === userId.toString());
        const appendUserCommented = append.comments.some(c => c.user.toString() === userId.toString());

        if (appendUserLiked || appendUserCommented) {
          append.likes.forEach(liker => {
            if (liker._id.toString() !== userId.toString()) {
              activities.push({
                type: 'like',
                actor: { id: liker._id, name: liker.name },
                post: { id: append._id, title: append.story, authorId: append.user },
                userLiked: appendUserLiked,
                userCommented: appendUserCommented,
                createdAt: story.updatedAt
              });
            }
          });

          // Comments
          append.comments.forEach(comment => {
            if (comment.user.toString() !== userId.toString()) {
              activities.push({
                type: 'comment',
                actor: { id: comment.user, name: comment.name },
                post: { id: append._id, title: append.story, authorId: append.user },
                userLiked: appendUserLiked,
                userCommented: appendUserCommented,
                createdAt: comment.createdAt
              });
            }
          });
        }
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return activities;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getActivitiesController = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const activities = await getActivities(userId);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getActivities, getActivitiesController };
