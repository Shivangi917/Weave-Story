const mongoose = require("mongoose");
const { Content, AppendedContent } = require("../models/Content.model");

const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: "Content not found" });

    if (content.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this content" });
    }

    const topAppends = await AppendedContent.find({ parentContent: contentId }).select("_id");

    const deleteNestedAppends = async (parentIds) => {
      if (!parentIds || parentIds.length === 0) return;
      const nested = await AppendedContent.find({ parentAppend: { $in: parentIds } }).select("_id");
      const nestedIds = nested.map((n) => n._id);
      await deleteNestedAppends(nestedIds);
      await AppendedContent.deleteMany({ _id: { $in: parentIds } });
    };

    const topAppendIds = topAppends.map((a) => a._id);
    await deleteNestedAppends(topAppendIds);

    // Delete top-level appends
    await AppendedContent.deleteMany({ parentContent: contentId });

    await content.deleteOne();

    return res.status(200).json({ message: "Content and all appends deleted successfully" });
  } catch (err) {
    console.error("Error deleting content:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { deleteContent };
