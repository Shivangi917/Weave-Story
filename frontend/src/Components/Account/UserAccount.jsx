import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById, loadPersonalStories } from "../../Utils/api";
import { toPastel } from "../../Utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";
import PostList from "../Post/PostList";

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

        <PostList stories={stories} hideHeader />
      </div>
    </div>
  );
};

export default UserAccount;
