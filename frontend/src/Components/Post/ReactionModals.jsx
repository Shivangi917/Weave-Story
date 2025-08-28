const ReactionModals = ({
  likesModal,
  commentsModal,
  closeLikes,
  closeComments,
}) => {
  return (
    <>
      {likesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded max-w-md w-full">
            <h3 className="font-bold mb-2">Likes</h3>
            {likesModal.map((u, i) => (
              <div key={u._id || `like-${i}`} className="border-b py-1">
                {u.name}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded max-w-md w-full">
            <h3 className="font-bold mb-2">Comments</h3>
            {commentsModal.map((c, i) => (
              <div key={c._id || `comment-${i}`} className="border-b py-1">
                <strong>{c.name}:</strong> {c.comment}
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