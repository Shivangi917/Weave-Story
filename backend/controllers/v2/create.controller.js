const { Content } = require("../../models/v2/Content.model");
const mongoose = require("mongoose");

const createContent = async (req, res) => {
  try {
    const { userId, name, content, color, genres } = req.body;

    if (!userId || !name || !content || !genres || genres.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    const newContent = new Content({ user: userId, name, content, color, genres });
    await newContent.save();

    res.status(201).json({ message: "Content created successfully!", newContent });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createContent };
