import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { toPastel } from "../../Utils/colorUtils";
import ReactionBar from "./ReactionBar";

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
  showLikes,
  showComments,
  canDeleteAppended,
  canLock,
  storyInputs,
  setStoryInputs,
  colorInputs,
  setColorInputs,
  commentInputs,
  setCommentInputs,
  handleAdd,
  openAccount,
}) => {
  return (
    <div>
      {expandedStoryId === story._id && (
        <div className="rounded-lg">
          {story.appendedBy.map((appended, index) => {
            const appendedLiked = user ? appended.likes.includes(user.id) : false;
            const commentKey = `${story._id}-${appended._id}`;
            return (
              <motion.div
                key={appended._id || `${story._id}-appended-${index}`}
                className="text-white text-lg md:text-xl font-light tracking-wide mb-6 relative group rounded-md p-2"
                style={{ backgroundColor: toPastel(appended.color) }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.3, duration: 0.6 }}
              >
                <div className="text-black flex justify-between items-start">
                  <div>
                    {appended.story}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openAccount(appended.user._id);
                      }}
                      className="text-sm text-black mt-1 opacity-0 group-hover:opacity-100 transition block hover:underline cursor-pointer"
                    >
                      {appended.name}
                    </span>
                  </div>

                  {canDeleteAppended(story, appended) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(story._id, index);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {canLock(story) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLockToggle(story._id, index, !appended.locked);
                        }}

                        className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                        {appended.locked ? "Unlock" : "Lock"}
                    </button>
                )}

                <ReactionBar
                  likes={appended.likes}
                  comments={appended.comments}
                  liked={appendedLiked}
                  onLike={(e) => {
                    e.stopPropagation();
                    handleLike(story._id, appended._id);
                  }}
                  onShowLikes={(e) => {
                    e.stopPropagation();
                    showLikes(story._id, appended._id);
                  }}
                  onComment={(e) => {
                    e.stopPropagation();
                    toggleCommentInput(commentKey);
                  }}
                  onShowComments={(e) => {
                    e.stopPropagation();
                    showComments(story._id, appended._id);
                  }}
                />

                {expandedCommentSection === commentKey && (
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
                        handleComment(story._id, appended._id);
                      }}
                      className="mt-1 bg-green-500 hover:bg-green-700 cursor-pointer text-white px-3 py-1 rounded my-2 text-sm"
                    >
                      Post
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div className="mt-4 flex flex-col md:flex-row gap-2 items-center">
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
        </div>
      )}
    </div>
  );
};

export default AppendedStory;
