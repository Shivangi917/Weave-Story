import { motion, AnimatePresence } from "framer-motion";
import { toPastel } from "../../Utils/colorUtils";
import AppendedStory from "./AppendedStory";
import ReactionBar from "./ReactionBar";

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
  handleEdit,
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
  openAccount
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
          className="group text-xl font-semibold text-gray-800"
        >
          {story.content}
          <div className="flex flex-wrap gap-2 my-2">
            {story.genres.map((genre, index) => (
              <span
                key={index}
                className="text-pink-500 hover:text-pink-700 text-sm bg-white px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span
              onClick={(e) => {
                e.stopPropagation();
                openAccount(story.user._id);
              }}
              className="text-sm text-black mt-1 transition block hover:underline cursor-pointer"
            >
              {story.user.name}
            </span >
            <span
              className="text-xs text-gray-600 mt-1"
            >
              Created on {new Date(story.createdAt).toLocaleString()}
            </span>
          </div>
          
          <div>
            {story.appendedBy.length > 0 && (
              <button 
                className="text-white text-sm bg-pink-500 px-2 py-1 rounded my-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStory(expandedStoryId === story._id ? null : story._id);
                }}>
                { expandedStoryId === story._id ? "Hide Appended Thread" : "Show Appended Thread"}
              </button>
            )}
          </div>
        </p>

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
            className="mt-1 bg-green-500 hover:bg-green-700 cursor-pointer text-white px-3 py-1 rounded my-2"
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
          handleEdit={handleEdit}
          showLikes={showLikes}
          showComments={showComments}
          canDeleteAppended={canDeleteAppended}
          canLock={canLock}
          commentInputs={commentInputs}
          setCommentInputs={setCommentInputs}
          openAccount={openAccount}
        />
      </AnimatePresence>

      <div className="my-4 flex flex-col md:flex-row gap-2 items-center">
        <textarea
          className="border border-green-300 rounded-lg p-3 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows={3}
          placeholder="Add to this story..."
          value={storyInputs[story._id] || ""}
          onChange={(e) =>
            setStoryInputs((prev) => ({
              ...prev,
              [story._id]: e.target.value,
            }))
          }
        />
        <input
          type="color"
          value={colorInputs[story._id] || "#aabbcc"}
          onChange={(e) =>
            setColorInputs((prev) => ({
              ...prev,
              [story._id]: e.target.value,
            }))
          }
          className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd(story._id);
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>
    </motion.div>
  );
};

export default StoryCard;
