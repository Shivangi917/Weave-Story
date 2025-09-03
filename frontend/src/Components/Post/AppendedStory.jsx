import { useState } from "react";
import { motion } from "framer-motion";
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
  handleEdit, 
  showLikes,
  showComments,
  canDeleteAppended,
  canLock,
  commentInputs,
  setCommentInputs,
  openAccount,
}) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      {expandedStoryId === story._id && (
        <div className="rounded-lg">
          {story.appendedBy.map((appended, index) => {
            const appendedLiked = user ? appended.likes.includes(user.id) : false;
            const commentKey = `${story._id}-${appended._id}`;
            const isLastAppend = index === story.appendedBy.length - 1;
            const canEdit = isLastAppend && user && user.id === appended.user._id;

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
                    {canEdit && editingId !== appended._id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(appended._id);
                          setCommentInputs((prev) => ({
                            ...prev,
                            [`edit-${commentKey}`]: appended.story,
                          }));
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mb-1"
                      >
                        Edit
                      </button>
                    )}

                    {editingId === appended._id ? (
                      <>
                        <textarea
                          className="border p-1 rounded w-150 text-black"
                          rows={2}
                          value={commentInputs[`edit-${commentKey}`] ?? appended.story}
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
                                story._id,
                                appended._id,
                                commentInputs[`edit-${commentKey}`] ?? appended.story
                              );
                              setEditingId(null);
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null); 
                            }}
                            className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>{appended.story}</p>
                    )}

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openAccount(appended.user._id);
                      }}
                      className="text-sm text-black mt-1 opacity-0 group-hover:opacity-100 transition block hover:underline cursor-pointer"
                    >
                      {appended.name}
                    </span>

                    {appended.createdAt &&
                      !isNaN(new Date(appended.createdAt).getTime()) && (
                        <span className="text-xs text-gray-600 mt-1">
                          Appended on {new Date(appended.createdAt).toLocaleString()}
                        </span>
                      )}
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
                    className="text-red-500 hover:text-red-700 text-sm bg-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition mt-2"
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
        </div>
      )}
    </div>
  );
};

export default AppendedStory;
