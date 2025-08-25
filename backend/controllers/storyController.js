const Story = require('../models/Story');

const getPersonalStories = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stories = await Story.find({
      $or: [
        { user: userId },
        { "appendedBy.user": userId }
      ]
    }).populate("user", "name description")
      .populate("appendedBy.user", "name");

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching personal stories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getFilteredStories = async (req, res) => {
  try {
    const { type } = req.params;

    switch(type) {

      case 'trending':
        stories = await Story.aggregate([
          {
            $addFields: {
              totalInteractions: {
                $add: [
                  { $size: { $ifNull: ["$likes", []] } },
                  { $size: { $ifNull: ["$comments", []] } },
                  { $size: { $ifNull: ["$appendedBy", []] } }
                ]
              }
            }
          },
          { $sort: { totalInteractions: -1, createdAt: -1 } },
          { $limit: 20 }
        ]);
        stories = await Story.populate(stories, [
          { path: "user", select: "name description" },
          { path: "appendedBy.user", select: "name" }
        ]);
        break;

      case 'popular':
        stories = await Story.aggregate([
          {
            $addFields: {
              totalComments: {
                $add: [
                  { $size: { $ifNull: ["$comments", []] } },
                  {
                    $sum: {
                      $map: {
                        input: { $ifNull: ["$appendedBy", []] },
                        as: "a",
                        in: { $size: { $ifNull: ["$$a.comments", []] } }
                      }
                    }
                  }
                ]
              }
            }
          },
          { $sort: { totalComments: -1, createdAt: -1 } },
          { $limit: 20 }
        ]);
        stories = await Story.populate(stories, [
          { path: "user", select: "name description" },
          { path: "appendedBy.user", select: "name" }
        ]);
        break;

      case 'recent':
        stories = await Story.find()
          .populate("user", "name description")
          .populate("appendedBy.user", "name")
          .sort({ createdAt: -1 })
          .limit(20);
        break;

      case 'random':
        const count = await Story.countDocuments();
        if (count === 0) {
          stories = [];
        } else {
          const randomCount = Math.min(10, count);
          stories = await Story.aggregate([
            { $sample: { size: randomCount } }
          ]);
          stories = await Story.populate(stories, [
            { path: "user", select: "name description" },
            { path: "appendedBy.user", select: "name" }
          ]);
        }
        break;

      default:
        stories = await Story.find()
          .populate("user", "name description")
          .populate("appendedBy.user", "name")
          .limit(20);
    }

    res.status(200).json(stories);

  } catch (error) {
    console.error("Error fetching filtered stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getFilteredStories, getPersonalStories };