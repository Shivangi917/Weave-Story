const Story = require("../models/Story");

const createStory = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Debugging line
  
      const { userId, name, story } = req.body;
      if (!userId || !name || !story) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const newStory = new Story({ user: userId, name, story });
      await newStory.save();
  
      res.status(201).json({ message: "Story created successfully!", newStory });
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { createStory };
