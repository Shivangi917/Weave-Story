import AppendedItem from "./AppendedItem";

const AppendedStory = ({
  story,
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
      {expandedStoryId === story._id && (
        <div className="rounded-lg">
          {story.appendedBy.map((appended, index) => (
            <AppendedItem
              key={appended._id || `${story._id}-appended-${index}`}
              appended={appended}
              index={index}
              story={story}
              user={user}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AppendedStory;
