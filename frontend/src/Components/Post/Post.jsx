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
      const payload = {
        storyId,
        userId: loggedInUser?.id, 
        name: loggedInUser?.name,  
        story: storyText,
      };

      console.log("Sending requests: ", payload);
      setStoryInputs((prevInputs) => ({ ...prevInputs, [storyId]: "" }));
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div>
      <h2>Stories</h2>
      {stories.map((story) => (
        <div key={story._id}>
          <p>{story.story}</p>
          {story.appendedBy.map((appended, index) => (
            <p key={index}>↳ {appended.story} (by {appended.name})</p>
          ))}
          <input
            type="text"
            value={storyInputs[story._id] || ""}
            onChange={(e) =>
              setStoryInputs((prevInputs) => ({
                ...prevInputs,
                [story._id]: e.target.value,
              }))
            }
            placeholder="Add to this story..."
          />
          <button onClick={() => handleAdd(story._id)}>Add Story</button>
        </div>
      ))}
    </div>
  );
};

export default Post;
