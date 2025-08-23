import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Post = ({ loggedInUser }) => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [storyInputs, setStoryInputs] = useState({});
  const [colorInputs, setColorInputs] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/stories")
      .then((response) => setStories(response.data))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  const handleAdd = async (storyId) => {
    const storyText = storyInputs[storyId] || "";
    const storyColor = colorInputs[storyId] || "#ffffff";

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
        color: storyColor,
      });

      const response = await axios.get("http://localhost:3000/api/stories");
      setStories(response.data);

      setStoryInputs((prev) => ({ ...prev, [storyId]: "" }));
      setColorInputs((prev) => ({ ...prev, [storyId]: "#ffffff" }));
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
        🌟 Stories
      </h2>

      {stories.length === 0 ? (
        <div className="text-center text-gray-500 italic">
          No stories yet... Be the first to create magic ✨
        </div>
      ) : (
        stories.map((story) => {
          const gradient = `linear-gradient(135deg, ${story.color}33, ${story.color}aa)`;

          return (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: gradient }}
              className="p-5 shadow-lg rounded-xl mb-6 border border-green-200 cursor-pointer"
              onClick={() => toggleStory(story._id)}
            >
              <p className="text-xl font-semibold text-gray-800">{story.story}</p>

              <AnimatePresence>
                {expandedStoryId === story._id && (
                  <div
                    className="mt-6 p-6 rounded-lg"
                    style={{
                      background: `linear-gradient(160deg, ${story.color}cc, ${story.color}ff)`,
                    }}
                  >
                    <motion.p
                      className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {story.story}
                      <span className="text-sm mt-1 text-gray-200 opacity-0 group-hover:opacity-100 transition">
                        — {story.createdBy?.name || "Anonymous"}
                      </span>
                    </motion.p>

                    {story.appendedBy.map((appended, index) => (
                      <motion.p
                        key={index}
                        className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group p-3 rounded-md"
                        style={{
                          background: `linear-gradient(160deg, ${appended.color}cc, ${appended.color}ff)`
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index + 2) * 0.8, duration: 0.8 }}
                      >
                        {appended.story}
                        <span className="text-sm text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition">
                          — {appended.name}
                        </span>
                      </motion.p>
                    ))}

                    <div className="mt-4 flex flex-col md:flex-row gap-2 items-center">
                      <textarea
                        className="border border-green-300 rounded-lg p-3 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        rows={3}
                        placeholder="Add to this story..."
                        value={storyInputs[story._id] || ""}
                        onChange={(e) =>
                          setStoryInputs((prev) => ({
                            ...prev,
                            [story._id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="color"
                        className="w-16 h-10 cursor-pointer border rounded"
                        value={colorInputs[story._id] || "#ffffff"}
                        onChange={(e) =>
                          setColorInputs((prev) => ({
                            ...prev,
                            [story._id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          handleAdd(story._id);
                          e.stopPropagation();
                        }}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
                      >
                        Add Story
                      </button>
                    </div>

                    <button
                      onClick={() => toggleStory(story._id)}
                      className="mt-3 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
                    >
                      Close Story
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default Post;
