import React, { useState, useEffect } from "react";
import axios from "axios";

const Post = ({ loggedInUser }) => {
  const [stories, setStories] = useState([]);
  const [storyInputs, setStoryInputs] = useState({}); 

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/stories")
      .then((response) => setStories(response.data))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const handleAdd = async (storyId) => {
    const storyText = storyInputs[storyId] || ""; 

    if (!storyText.trim()) {
      alert("Story cannot be empty!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/appendStory", {
        storyId,
        userId: loggedInUser?.id,
        name: loggedInUser?.name,
        story: storyText,
      });

      const response = await axios.get("http://localhost:3000/api/stories");
      setStories(response.data);

      setStoryInputs((prevInputs) => ({ ...prevInputs, [storyId]: "" }));
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">Stories</h2>
      {stories.map((story) => (
        <div key={story._id} className="bg-white p-4 shadow-md rounded-lg mb-4 border border-green-200">
          <p className="text-gray-700 font-medium">{story.story}</p>
          <div className="mt-2 border-l-4 border-green-400 pl-4 space-y-2">
            {story.appendedBy.map((appended, index) => (
              <p key={index} className="text-sm text-gray-600">↳ {appended.story} <span className="text-pink-500">(by {appended.name})</span></p>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="border border-green-300 rounded-md px-3 py-2 w-full focus:ring-green-500 focus:border-green-500"
              value={storyInputs[story._id] || ""}
              onChange={(e) =>
                setStoryInputs((prevInputs) => ({
                  ...prevInputs,
                  [story._id]: e.target.value,
                }))
              }
              placeholder="Add to this story..."
            />
            <button
              onClick={() => handleAdd(story._id)}
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
