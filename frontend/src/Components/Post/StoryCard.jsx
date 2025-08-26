import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { toPastel } from "../../Utils/colorUtils";
import AppendedStory from "./AppendedStory";

const StoryCard = ({
  story,
  user,
  expandedStoryId,
  expandedCommentSection,
  toggleStory,
  toggleCommentInput,
  handleLike,
  handleDelete,
  handleLockToggle,
  handleComment,
  showLikes,
  showComments,
  canDeleteStory,
  canDeleteAppended,
  canLock,
  storyInputs,
  setStoryInputs,
  colorInputs,
  setColorInputs,
  commentInputs,
  setCommentInputs,
  handleAdd,
}) => {
  const liked = story.likes.includes(user.id);

  return (
    <motion.div
      key={story._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ background: toPastel(story.color) }}
      className="p-5 shadow-lg rounded-xl mb-6 border border-green-200"
    >
      <div className="flex justify-between items-start">
        <p
          className="text-xl font-semibold text-gray-800 cursor-pointer"
          onClick={() =>
            toggleStory(expandedStoryId === story._id ? null : story._id)
          }
        >
          {story.story}
        </p>

        <div className="flex gap-5 items-center mt-2">
          <div className="flex items-center gap-1">
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(story._id);
              }}
            >
              <FaHeart
                size={24}
                className={liked ? "text-red-500" : "text-gray-400"}
              />
            </div>
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                showLikes(story._id);
              }}
            >
              {story.likes.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleCommentInput(
                  expandedCommentSection === `${story._id}-root`
                    ? null
                    : `${story._id}-root`
                );
              }}
            >
              <FaRegComment size={22} className="text-black" />
            </div>
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                showComments(story._id);
              }}
            >
              {story.comments.length}
            </span>
          </div>
        </div>
      </div>

      {expandedCommentSection === `${story._id}-root` && (
        <div className="mt-2">
          <textarea
            className="border p-2 rounded w-full"
            rows={2}
            placeholder="Add a comment..."
            value={commentInputs[`${story._id}-root`] || ""}
            onChange={(e) =>
              setCommentInputs((prev) => ({
                ...prev,
                [`${story._id}-root`]: e.target.value,
              }))
            }
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleComment(story._id);
            }}
            className="mt-1 bg-green-500 text-white px-3 py-1 rounded"
          >
            Post
          </button>
        </div>
      )}

      <AnimatePresence>
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

        <AppendedStory
          story={story}
          user={user}
          expandedStoryId={expandedStoryId}
          expandedCommentSection={expandedCommentSection}
          toggleStory={toggleStory}
          toggleCommentInput={toggleCommentInput}
          handleLike={handleLike}
          handleDelete={handleDelete}
          handleLockToggle={handleLockToggle}
          handleComment={handleComment}
          showLikes={showLikes}
          showComments={showComments}
          canDeleteAppended={canDeleteAppended}
          canLock={canLock}
          storyInputs={storyInputs}
          setStoryInputs={setStoryInputs}
          colorInputs={colorInputs}
          setColorInputs={setColorInputs}
          commentInputs={commentInputs}
          setCommentInputs={setCommentInputs}
          handleAdd={handleAdd}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default StoryCard;
