import useOpenAccount from "../../Hooks/useOpenAccount";

const UserListModal = ({ title, users, onClose }) => {
  const openAccount = useOpenAccount();

  const handleOpenAccount = (userId) => {
    onClose();
    openAccount(userId);
  }

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-300 rounded-2xl shadow-2xl p-6 w-80 md:w-96 max-h-[80vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-600">{title}</h2>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-600 transition"
          >
            ✕
          </button>
        </div>

        {users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u._id}
                className="flex items-center gap-3 border-b pb-2 border-green-100 cursor-pointer hover:bg-gray-200 p-3 rounded-sm mb-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAccount(u._id);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">
                  {u.name.charAt(0)}
                </div>
                <span className="text-gray-800">{u.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserListModal;
