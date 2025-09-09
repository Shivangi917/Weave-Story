const EditControls = ({
  appended,
  commentKey,
  commentInputs,
  setCommentInputs,
  handleEdit,
  storyId,
  onCancel,
}) => (
  <>
    <textarea
      className="border p-1 rounded w-150 text-black"
      rows={2}
      value={commentInputs[`edit-${commentKey}`] ?? appended.content}
      onChange={(e) =>
        setCommentInputs((prev) => ({
          ...prev,
          [`edit-${commentKey}`]: e.target.value,
        }))
      }
    />
    <div className="flex mt-1 gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(
            storyId,
            appended._id,
            commentInputs[`edit-${commentKey}`] ?? appended.content
          );
          onCancel();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
      >
        Save
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        Cancel
      </button>
    </div>
  </>
);

export default EditControls;
