import { useAuth } from "../../Context/AuthContext";

const Account = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 text-center w-80 md:w-96">
        <div className="w-24 h-24 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {user?.name?.charAt(0) || "U"}
        </div>

        <h2 className="text-2xl font-bold mb-1">{user?.name || "Unknown"}</h2>

        {user ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{user?.email || "No email"}</p>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={logout}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition"
              >
                Logout
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                View My Stories
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              View Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
