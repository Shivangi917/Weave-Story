import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../Context/AuthContext';

const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const rgbToHex = (r, g, b) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

const toPastel = (hex, whiteRatio = 0.7) => {
  const [r, g, b] = hexToRgb(hex);
  const newR = Math.round(r * (1 - whiteRatio) + 255 * whiteRatio);
  const newG = Math.round(g * (1 - whiteRatio) + 255 * whiteRatio);
  const newB = Math.round(b * (1 - whiteRatio) + 255 * whiteRatio);
  return rgbToHex(newR, newG, newB);
};

const Post = () => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [storyInputs, setStoryInputs] = useState({});
  const [colorInputs, setColorInputs] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = () => {
    axios
      .get("http://localhost:3000/api/stories")
      .then((response) => setStories(response.data))
      .catch((error) => console.error("Error fetching stories:", error));
  };

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  const handleAdd = async (storyId) => {
    const storyText = storyInputs[storyId] || "";
    const userColor = colorInputs[storyId] || "#ffffff";
    const pastelColor = toPastel(userColor);

    if (!storyText.trim()) {
      alert("Story cannot be empty!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/appendStory", {
        storyId,
        userId: user?.id,
        name: user?.name,
        story: storyText,
        color: pastelColor,
      });

      fetchStories();

      setStoryInputs((prev) => ({ ...prev, [storyId]: "" }));
      setColorInputs((prev) => ({ ...prev, [storyId]: "#ffffff" }));
    } catch (error) {
      console.error("Error adding story: ", error);
    }
  };

  const handleDelete = async (storyId, appendedIndex = null) => {
    const isDeletingWholeStory = appendedIndex === null;
    const message = isDeletingWholeStory 
      ? "Are you sure you want to delete this entire story?" 
      : "Are you sure you want to delete this story segment?";
    
    if (!window.confirm(message)) {
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/deleteStory", {
        storyId,
        appendedIndex, 
        userId: user?.id,
      });

      fetchStories();
    } catch (error) {
      console.error("Error deleting story: ", error);
      alert("Failed to delete. You may not have permission.");
    }
  };

  const canDeleteStory = (story) => {
    return user && story.user._id === user.id;
  };

  const canDeleteAppended = (story, appended) => {
    return user && (story.user === user.id || appended.user === user.id);
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
              style={{ background: toPastel(story.color), cursor: "pointer" }}
              className="p-5 shadow-lg rounded-xl mb-6 border border-green-200 cursor-pointer"
              onClick={() => toggleStory(story._id)}
            >
              <div className="flex justify-between items-start">
                <p className="text-xl font-semibold text-gray-800">{story.story}</p>
                
                {canDeleteStory(story) && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(story._id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded"
                  >
                    Delete Story
                  </button>
                )}
              </div>

              <AnimatePresence>
                {expandedStoryId === story._id && (
                  <div className="mt-6 p-6 rounded-lg">
                    <motion.p
                      className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {story.story}
                      <span className="text-sm mt-1 text-gray-200 opacity-0 group-hover:opacity-100 transition">
                        — {story.name || "Anonymous"}
                      </span>
                    </motion.p>

                    {story.appendedBy.map((appended, index) => (
                      <motion.div
                        key={index}
                        className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group p-3 rounded-md"
                        style={{ backgroundColor: toPastel(appended.color) }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index + 2) * 0.8, duration: 0.8 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {appended.story}
                            <span className="text-sm text-black mt-1 opacity-0 group-hover:opacity-100 transition block">
                              — {appended.name}
                            </span>
                          </div>
                          
                          {canDeleteAppended(story, appended) && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(story._id, index);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </motion.div>
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