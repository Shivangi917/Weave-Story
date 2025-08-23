const Story = require('../models/Story');

const addStory = async (req, res) => {
    try {
        console.log("Request Body:", req.body); 

        const { storyId, userId, name, story, color } = req.body;

        if (!storyId?.trim() || !userId?.trim() || !name?.trim() || !story?.trim()) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid story ID format." });
        }

        const existingStory = await Story.findById(storyId);
        if (!existingStory) {
            return res.status(404).json({ message: "Story not found." });
        }

        existingStory.appendedBy.push({ user: userId, name, story, color });
        await existingStory.save();

        res.status(200).json({ message: "Story appended successfully!", updatedStory: existingStory });

    } catch (error) {
        console.error("Error adding story:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addStory };
