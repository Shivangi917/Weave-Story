import ReactionBar from "../Reaction/ReactionBar";

const StoryActions = ({
  story,
  user,
  expandedCommentSection,
  toggleCommentInput,
  showLikes,
  showComments,
  handleLike,
  handleDelete,
  canDeleteStory,
}) => {
  const liked = story.likes.includes(user.id);

  return (
    <div className="flex justify-between items-start">
      <ReactionBar
        likes={story.likes}
        comments={story.comments}
        liked={liked}
        onLike={() => handleLike(story._id)}
        onShowLikes={() => showLikes(story._id)}
        onComment={() =>
          toggleCommentInput(
            expandedCommentSection === `${story._id}-root` ? null : `${story._id}-root`
          )
        }
        onShowComments={() => showComments(story._id)}
      />

      {canDeleteStory(story) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(story._id);
          }}
          className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded my-2"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default StoryActions;
