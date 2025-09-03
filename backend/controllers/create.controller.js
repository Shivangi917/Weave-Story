const Story = require("../models/Story.model");
const mongoose = require("mongoose");

const createStory = async (req, res) => {
    try {
      const { userId, name, story, color, genres } = req.body;
      if (!userId || !name || !story || genres.length === 0) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid ID format." });
      }
  
      const newStory = new Story({ user: userId, name, story, color, genres });
      await newStory.save();
  
      res.status(201).json({ message: "Story created successfully!", newStory });
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { createStory };
