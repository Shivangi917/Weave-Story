import useOpenAccount from "../../Hooks/useOpenAccount";

const ProfileCard = ({
  profile,
  isSelf,
  doesFollow,
  onFollowToggle,
  onLogout,
  onShowFollowers,
  onShowFollowing,
}) => {
  const openAccount = useOpenAccount();

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 text-center w-80 md:w-96 mb-6">
      <div
        className="w-24 h-24 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-3xl font-bold text-white mb-4 cursor-pointer"
        onClick={() => openAccount(profile?._id)}
      >
        {profile?.name?.charAt(0) || "U"}
      </div>

      <h2 className="text-2xl font-bold mb-1">{profile?.name || "Unknown"}</h2>
      {profile?.email && <p className="text-sm text-gray-500 mb-4">{profile.email}</p>}

      {isSelf && (
        <button
          aria-label="Logout"
          onClick={onLogout}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg transition"
        >
          Logout
        </button>
      )}

      {!isSelf && (
        <button
          onClick={onFollowToggle}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            doesFollow
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
              : "bg-pink-500 text-white hover:bg-pink-400"
          }`}
        >
          {doesFollow ? "Following" : "Follow"}
        </button>
      )}

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex flex-col items-center">
          <button
            onClick={onShowFollowers}
            className="text-blue-600 hover:underline font-bold"
          >
            {profile?.followers?.length || 0}
          </button>
          <span className="text-gray-500">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={onShowFollowing}
            className="text-blue-600 hover:underline font-bold"
          >
            {profile?.following?.length || 0}
          </button>
          <span className="text-gray-500">Following</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
