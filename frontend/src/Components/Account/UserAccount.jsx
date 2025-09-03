import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById, loadPersonalStories, toggleFollowUser } from "../../Utils/api";
import PostList from "../Post/PostList";
import { useAuth } from "../../Context/AuthContext";
import UserListModal from "./UserListModal";
import ProfileCard from "./ProfileCard";

const UserAccount = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [doesFollow, setDoesFollow] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchStories();
      loadUser();
    }
  }, [userId, user]);

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

      if (data?.followers?.some((follower) => follower._id === user?.id)) {
        setDoesFollow(true);
      } else {
        setDoesFollow(false);
      }
    } catch (err) {
      console.error("Error fetching user: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowClick = async () => {
    try {
      await toggleFollowUser({ userId, currentUserId: user?.id });
      setDoesFollow((prev) => !prev);
    } catch (err) {
      console.error("Error on clicking Follow button: ", err);
    }
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
      <ProfileCard
        profile={profile}
        isSelf={false}
        doesFollow={doesFollow}
        onFollowToggle={handleFollowClick}
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
        <h3 className="text-xl font-bold mb-4">Stories by {profile?.name}</h3>
        <PostList stories={stories} hideHeader />
      </div>
    </div>
  );
};

export default UserAccount;
