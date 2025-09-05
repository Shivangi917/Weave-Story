import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { loadPersonalStories, fetchUserById } from "../../Utils/api";
import PostList from "../Post/PostList";
import UserListModal from "./UserListModal";
import ProfileCard from "./ProfileCard";

const Account = () => {
  const [stories, setStories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchStories();
      loadUser();
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

  const loadUser = async () => {
    try {
      const data = await fetchUserById(user.id);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user: ", err);
    } finally {
      setLoading(false);
    }
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
      <ProfileCard
        profile={profile}
        isSelf={true}
        onLogout={logout}
        onShowFollowers={() => setShowFollowers(true)}
        onShowFollowing={() => setShowFollowing(true)}
      />

      {showFollowers && (
        <UserListModal
          title="Followers"
          users={profile?.followers || []}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <UserListModal
          title="Following"
          users={profile?.following || []}
          onClose={() => setShowFollowing(false)}
        />
      )}

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">My Stories</h3>
        <PostList stories={stories} hideHeader />
      </div>
    </div>
  );
};

export default Account;
