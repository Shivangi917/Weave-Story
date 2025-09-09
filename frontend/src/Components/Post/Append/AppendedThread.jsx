import AppendedStory from "./AppendedStory";

const AppendedThread = ({
  story,
  toggleStory,
  user,
  expandedStoryId,
  expandedCommentSection,
  toggleCommentInput,
  handleLike,
  handleDelete,
  handleLockToggle,
  handleComment,
  handleEdit,
  showLikes,
  showComments,
  canDeleteAppended,
  canLock,
  commentInputs,
  setCommentInputs,
  openAccount,
}) => {
  return (
    <div>
      {story.appendedBy.length > 0 && (
        <button
          className="text-white text-sm bg-pink-500 px-2 py-1 rounded my-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleStory(expandedStoryId === story._id ? null : story._id);
          }}
        >
          {expandedStoryId === story._id ? "Hide Appended Thread" : "Show Appended Thread"}
        </button>
      )}

      <AppendedStory
        story={story}
        user={user}
        expandedStoryId={expandedStoryId}
        expandedCommentSection={expandedCommentSection}
        toggleCommentInput={toggleCommentInput}
        handleLike={handleLike}
        handleDelete={handleDelete}
        handleLockToggle={handleLockToggle}
        handleComment={handleComment}
        handleEdit={handleEdit}
        showLikes={showLikes}
        showComments={showComments}
        canDeleteAppended={canDeleteAppended}
        canLock={canLock}
        commentInputs={commentInputs}
        setCommentInputs={setCommentInputs}
        openAccount={openAccount}
      />
    </div>
  );
};

export default AppendedThread;
