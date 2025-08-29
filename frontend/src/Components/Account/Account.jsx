import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { loadPersonalStories } from "../../Utils/api";
import { toPastel } from "../../Utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";

const Account = () => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      const data = await loadPersonalStories(user.id);
      setStories(data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">You must be logged in to view your account</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 text-green-800 p-6 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 text-center w-80 md:w-96 mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {user?.name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-bold mb-1">{user?.name || "Unknown"}</h2>
        <p className="text-sm text-gray-500 mb-4">{user?.email || "No email"}</p>

        <button
          aria-label="Logout"
          onClick={logout}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">My Stories</h3>

        {stories.length > 0 ? (
          stories.map((story) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: toPastel(story.color), cursor: "pointer" }}
              className="p-5 shadow-lg rounded-xl mb-6 border border-green-200"
              onClick={() => toggleStory(story._id)}
            >
              <p className="text-lg font-semibold text-gray-800">{story.story}</p>

              <AnimatePresence>
                {expandedStoryId === story._id && (
                  <div className="mt-4 p-4 rounded-lg">
                    {story.appendedBy.map((appended, index) => (
                      <motion.div
                        key={index}
                        className="text-black text-base font-light tracking-wide mb-4 p-3 rounded-md"
                        style={{ backgroundColor: toPastel(appended.color) }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3, duration: 0.6 }}
                      >
                        <p>
                          {appended.story}{" "}
                          <span className="text-sm text-gray-700 block mt-1">
                            — {appended.name}
                          </span>
                        </p>
                      </motion.div>
                    ))}

                    <button
                      aria-label="Close Story"
                      onClick={() => toggleStory(story._id)}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                    >
                      Close Story
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No stories yet.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
