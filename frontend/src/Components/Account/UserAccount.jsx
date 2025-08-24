import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../Utils/api";

const UserAccount = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadUser();
  }, [userId]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-blue-800 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 text-center w-80 md:w-96">
        <div className="w-24 h-24 mx-auto rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {profile?.name?.charAt(0) || "U"}
        </div>

        <h2 className="text-2xl font-bold mb-1">{profile?.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{profile?.email || "No email"}</p>

        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
        >
          View {profile?.name?.split(" ")[0] || "User"}'s Stories
        </button>
      </div>
    </div>
  );
};

export default UserAccount;
