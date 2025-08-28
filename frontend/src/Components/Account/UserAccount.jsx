import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById, loadPersonalStories } from "../../Utils/api";
import { toPastel } from "../../Utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";

const UserAccount = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchStories();
      loadUser();
    }
  }, [userId]);

  const fetchStories = async () => {
    try {
      const data = await loadPersonalStories(userId);
      setStories(data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  const loadUser = async () => {
    try {
      const data = await fetchUserById(userId);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-blue-800 p-6 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 text-center w-80 md:w-96 mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {profile?.name?.charAt(0) || "U"}
        </div>
        <h2 className="text-2xl font-bold mb-1">{profile?.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{profile?.email || "No email"}</p>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Stories by {profile?.name}</h3>

        {stories.length > 0 ? (
          stories.map((story) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: toPastel(story.color), cursor: "pointer" }}
              className="p-5 shadow-lg rounded-xl mb-6 border border-blue-200"
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
                      onClick={() => toggleStory(story._id)}
                      className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
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

export default UserAccount;
