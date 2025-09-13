const { Content, AppendedContent } = require("../models/Content.model");
const mongoose = require("mongoose");

function buildAppendTree(appends) {
  const map = {};
  const roots = [];

  appends.forEach(a => {
    a.appendedContents = [];
    map[a._id.toString()] = a;
  });

  appends.forEach(a => {
    if (a.parentAppend) {
      const parent = map[a.parentAppend.toString()];
      if (parent) parent.appendedContents.push(a);
    } else {
      roots.push(a);
    }
  });

  return roots;
}

const getPersonalStories = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const contents = await Content.find({ user: userId })
      .populate("user", "name description")
      .populate("comments.user", "name")
      .lean();

    const appendedContents = await AppendedContent.find({
      $or: [
        { parentContent: { $in: contents.map(c => c._id) } },
        { parentAppend: { $exists: true } }
      ]
    })
      .populate("user", "name")
      .populate("comments.user", "name")
      .lean();

    const stories = contents.map(content => {
      const relatedAppends = appendedContents.filter(
        a => a.parentContent?.toString() === content._id.toString() || a.parentAppend
      );
      return {
        ...content,
        appendedContents: buildAppendTree(relatedAppends)
      };
    });

    res.status(200).json({ stories });
  } catch (error) {
    console.error("Error fetching personal stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFilteredStories = async (req, res) => {
  try {
    const { type, genre, search } = req.query;

    const match = {};
    if (genre) match.genres = { $in: [new RegExp(`^${genre}$`, "i")] };
    if (search) {
      const regex = new RegExp(search, "i");
      match.$or = [{ name: regex }, { content: regex }, { genres: regex }];
    }

    let contents = [];
    switch (type) {
      case "trending":
        contents = await Content.aggregate([
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
        contents = await Content.aggregate([
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
        contents = await Content.find(match).sort({ createdAt: -1 }).limit(20).lean();
        break;

      case "random":
        const count = await Content.countDocuments(match);
        contents =
          count === 0
            ? []
            : await Content.aggregate([{ $match: match }, { $sample: { size: Math.min(10, count) } }]);
        break;

      default:
        contents = await Content.find(match).lean();
    }

    contents = await Content.populate(contents, [
      { path: "user", select: "name description" },
      { path: "comments.user", select: "name" },
    ]);

    const appendedContents = await AppendedContent.find({
      $or: [
        { parentContent: { $in: contents.map(c => c._id) } },
        { parentAppend: { $exists: true } }
      ]
    })
      .populate("user", "name")
      .populate("comments.user", "name")
      .lean();

    const stories = contents.map(content => {
      const relatedAppends = appendedContents.filter(
        a => a.parentContent?.toString() === content._id.toString() || a.parentAppend
      );
      return {
        ...content,
        appendedContents: buildAppendTree(relatedAppends)
      };
    });
    
    res.status(200).json({ stories });
  } catch (error) {
    console.error("Error fetching filtered stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPersonalStories, getFilteredStories };
