const ReactionModals = ({
  likesModal,
  commentsModal,
  closeLikes,
  closeComments,
  openAccount
}) => {
  return (
    <>
      {likesModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded max-w-md w-full">
            <h3 className="font-bold mb-2">Likes</h3>
            {likesModal.map((u, i) => (
              <div key={u._id || `like-${i}`} className="border-gray-50 p-2 mb-2 rounded-sm shadow-sm py-1 flex items-center hover:cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                openAccount(u._id);
              }}>
                <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <span
                  className="text-sm text-black group-hover:opacity-100 transition block hover:underline cursor-pointer"
                >
                  {u.name}
                </span>
              </div>
            ))}
            <button
              onClick={closeLikes}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {commentsModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded max-w-md w-full">
            <h3 className="font-bold mb-2">Comments</h3>
            {commentsModal.map((c, i) => (
              <div key={c._id || `comment-${i}`}     className="border-gray-50 p-2 mb-2 rounded-sm shadow-sm py-1 flex items-center hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                openAccount(c.user._id);
              }}>
                <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <span
                  className="text-sm text-black group-hover:opacity-100 transition block hover:underline"
                >
                  {c.name}
                </span>
                <p>: {c.comment}</p>
              </div>
            ))}
            <button
              onClick={closeComments}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReactionModals;