const CommentBox = ({
  storyId,
  appendedId,
  commentKey,
  commentInputs,
  setCommentInputs,
  handleComment,
}) => (
  <div className="mt-2">
    <textarea
      className="border p-2 rounded w-full"
      rows={2}
      placeholder="Add a comment..."
      value={commentInputs[commentKey] || ""}
      onChange={(e) =>
        setCommentInputs((prev) => ({
          ...prev,
          [commentKey]: e.target.value,
        }))
      }
      onClick={(e) => e.stopPropagation()}
    />
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleComment(storyId, appendedId);
      }}
      className="mt-1 bg-green-500 hover:bg-green-700 cursor-pointer text-white px-3 py-1 rounded my-2 text-sm"
    >
      Post
    </button>
  </div>
);

export default CommentBox;
