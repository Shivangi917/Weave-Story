import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Post = ({ loggedInUser }) => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/stories")
      .then((response) => setStories(response.data))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
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
        stories.map((story) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-5 shadow-lg rounded-xl mb-6 border border-green-200 cursor-pointer"
            onClick={() => toggleStory(story._id)}
          >

            <p className="text-xl font-semibold text-gray-800">
              {story.story}
            </p>

            <AnimatePresence>
              {expandedStoryId === story._id && (
                <div className="mt-6 bg-gradient-to-b from-purple-900 to-black text-center p-6 rounded-lg">
                  <motion.p
                    className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    {story.story}
                    <span className="text-sm mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition">
                      — {story.createdBy?.name || "Anonymous"}
                    </span>
                  </motion.p>

                  {story.appendedBy.map((appended, index) => (
                    <motion.p
                      key={index}
                      className="text-white text-2xl md:text-3xl font-light tracking-wide mb-6 relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 2) * 0.8, duration: 0.8 }}
                    >
                      {appended.story}
                      <span className="text-sm text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition">
                        — {appended.name}
                      </span>
                    </motion.p>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Post;
