import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { loadPersonalStories } from "../../Utils/api";
import { toPastel } from "../../Utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";
import PostList from "../Post/PostList";

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

        <PostList stories={stories} hideHeader />
      </div>
    </div>
  );
};

export default Account;
