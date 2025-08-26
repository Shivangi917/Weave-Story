const Story = require("../models/Story");

const getPersonalStories = async (req, res) => {
  try {
    const { userId } = req.params;

    const stories = await Story.find({
      $or: [{ user: userId }, { "appendedBy.user": userId }],
    })
      .populate("user", "name description")
      .populate("appendedBy.user", "name");

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching personal stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFilteredStories = async (req, res) => {
  try {
    const { type, genre, search } = req.query;
    let stories = [];

    const match = {};
    if (genre) {
      match.genres = { $in: [new RegExp(`^${genre}$`, "i")] };
    }
    if (search) {
      const regex = new RegExp(search, "i");
      match.$or = [
        { title: regex },
        { content: regex },
        { genre: regex },
      ];
    }

    switch (type) {
      case "trending":
        stories = await Story.aggregate([
          { $match: match },
          {
            $addFields: {
              totalInteractions: {
                $add: [
                  { $size: { $ifNull: ["$likes", []] } },
                  { $size: { $ifNull: ["$comments", []] } },
                  { $size: { $ifNull: ["$appendedBy", []] } },
                ],
              },
            },
          },
          { $sort: { totalInteractions: -1, createdAt: -1 } },
          { $limit: 20 },
        ]);
        break;

      case "popular":
        stories = await Story.aggregate([
          { $match: match },
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
                        in: { $size: { $ifNull: ["$$a.comments", []] } },
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { totalComments: -1, createdAt: -1 } },
          { $limit: 20 },
        ]);
        break;

      case "recent":
        stories = await Story.find(match)
          .sort({ createdAt: -1 })
          .limit(20);
        break;

      case "random":
        const count = await Story.countDocuments(match);
        stories =
          count === 0
            ? []
            : await Story.aggregate([
                { $match: match },
                { $sample: { size: Math.min(10, count) } },
              ]);
        break;

      default:
        stories = await Story.find(match).limit(20);
    }

    stories = await Story.populate(stories, [
      { path: "user", select: "name description" },
      { path: "appendedBy.user", select: "name" },
    ]);

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching filtered stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getFilteredStories, getPersonalStories };
