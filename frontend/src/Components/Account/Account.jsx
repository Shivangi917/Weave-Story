import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserById } from "../../Utils/api/api";
import ContentList from "../Post/Content/ContentList";
import UserListModal from "./UserListModal";
import ProfileCard from "./ProfileCard";

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadUser();
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const data = await fetchUserById(user.id);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user: ", err);
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
        <ContentList personalStories={true} userId={user.id}/>
      </div>
    </div>
  );
};

export default Account;
