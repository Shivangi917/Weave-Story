import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { toPastel } from "../../Utils/colorUtils";
import { 
  appendStory, 
  deleteStory, 
  getFilteredStories, 
  likeStory, 
  commentStory, 
  getStoryLikes, 
  getStoryComments,
  likeAppendedStory,
  commentAppendedStory
} from "../../Utils/api";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegComment } from "react-icons/fa";

const Post = ({ filter = "default" }) => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [expandedCommentSection, setExpandedCommentSection] = useState(null);
  const [storyInputs, setStoryInputs] = useState({});
  const [colorInputs, setColorInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likesModal, setLikesModal] = useState(null);
  const [commentsModal, setCommentsModal] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadStories(filter);
  }, [filter]);

  const openAccount = (userId) => navigate(`/account/${userId}`);

  const toggleStory = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  const toggleCommentInput = (id) => {
    setExpandedCommentSection(expandedCommentSection === id ? null : id);
  };

  const loadStories = async (type) => {
    try {
      const data = await getFilteredStories(type);
      setStories(data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  const handleLike = async (storyId, appendedId = null) => {
    try {
      if (appendedId === null) {
        await likeStory(storyId, { userId: user.id });
      } else {
        await likeAppendedStory(storyId, appendedId, { userId: user.id });
      }
      await loadStories(filter);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (storyId, appendedId = null) => {
    const text = commentInputs[`${storyId}-${appendedId ?? "root"}`] || "";
    if (!text.trim()) return;

    try {
      if (appendedId === null) {
        await commentStory(storyId, {
          userId: user.id,
          name: user.name,
          comment: text,
        });
      } else {
        await commentAppendedStory(storyId, appendedId, {
          userId: user.id,
          name: user.name,
          comment: text,
        });
      }

      await loadStories(filter);
      setCommentInputs(prev => ({
        ...prev,
        [`${storyId}-${appendedId ?? "root"}`]: "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const showLikes = async (storyId, appendedId = null) => {
    try {
      const res =
        appendedId === null
          ? await getStoryLikes(storyId)
          : await getAppendedStoryLikes(storyId, appendedId);
      setLikesModal(res.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const showComments = async (storyId, appendedId = null) => {
    try {
      const res =
        appendedId === null
          ? await getStoryComments(storyId)
          : await getAppendedStoryComments(storyId, appendedId);
      setCommentsModal(res.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (storyId) => {
    const storyText = storyInputs[storyId] || "";
    const userColor = colorInputs[storyId] || "#ffffff";
    const pastelColor = toPastel(userColor);

    if (!storyText.trim()) return alert("Story cannot be empty!");

    try {
      await appendStory({
        storyId,
        userId: user?.id,
        name: user?.name,
        story: storyText,
        color: pastelColor,
      });

      await loadStories(filter);
      setStoryInputs((prev) => ({ ...prev, [storyId]: "" }));
      setColorInputs((prev) => ({ ...prev, [storyId]: "#ffffff" }));
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  const handleDelete = async (storyId, appendedIndex = null) => {
    const isDeletingWholeStory = appendedIndex === null;
    const message = isDeletingWholeStory
      ? "Are you sure you want to delete this entire story?"
      : "Are you sure you want to delete this story segment?";
    if (!window.confirm(message)) return;

    try {
      await deleteStory({ storyId, appendedIndex, userId: user?.id });
      await loadStories(filter);
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete. You may not have permission.");
    }
  };

  const canDeleteStory = (story) => user && story.user._id === user.id;
  const canDeleteAppended = (story, appended) =>
    user && (story.user._id === user.id || appended.user === user.id);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
        🌟 Stories
      </h2>

      {!Array.isArray(stories) || stories.length === 0 ? (
        <div className="text-center text-gray-500 italic">
          No stories yet... Be the first to create magic ✨
        </div>
      ) : (
        stories.map((story) => {
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
                  onClick={() => toggleStory(story._id)}
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
                        toggleCommentInput(`${story._id}-root`);
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

                {expandedStoryId === story._id && (
                  <div className="rounded-lg">
                    {story.appendedBy.map((appended, index) => {
                      const appendedLiked = appended.likes.includes(user.id);
                      return (
                        <motion.div
                          key={appended._id || `${story._id}-appended-${index}`}
                          className="text-white text-lg md:text-xl font-light tracking-wide mb-6 relative group rounded-md p-2"
                          style={{ backgroundColor: toPastel(appended.color) }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index + 1) * 0.3, duration: 0.6 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              {appended.story}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAccount(appended.user);
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

                          <div className="flex gap-5 items-center mt-2">
                            <div className="flex items-center gap-1">
                              <div
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(story._id, appended._id);
                                }}
                              >
                                <FaHeart
                                  size={20}
                                  className={
                                    appendedLiked ? "text-red-500" : "text-gray-400"
                                  }
                                />
                              </div>
                              <span
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showLikes(story._id, appended._id);
                                }}
                              >
                                {appended.likes.length}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <div
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCommentInput(`${story._id}-${index}`);
                                }}
                              >
                                <FaRegComment size={18} className="text-black" />
                              </div>
                              <span
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showComments(story._id, appended._id);
                                }}
                              >
                                {appended.comments.length}
                              </span>
                            </div>
                          </div>

                          {expandedCommentSection === `${story._id}-${index}` && (
                            <div className="mt-2">
                              <textarea
                                className="border p-2 rounded w-full"
                                rows={2}
                                placeholder="Add a comment..."
                                value={commentInputs[`${story._id}-${index}`] || ""}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [`${story._id}-${index}`]: e.target.value,
                                  }))
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComment(story._id, appended._id);
                                }}
                                className="mt-1 bg-green-500 text-white px-3 py-1 rounded"
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
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="color"
                        className="w-16 h-10 cursor-pointer border rounded"
                        value={colorInputs[story._id] || "#ffffff"}
                        onChange={(e) =>
                          setColorInputs((prev) => ({
                            ...prev,
                            [story._id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(story._id);
                        }}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
                      >
                        Add Story
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStory(story._id);
                      }}
                      className="mt-3 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
                    >
                      Close Story
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}

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
              onClick={() => setLikesModal(null)}
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
              onClick={() => setCommentsModal(null)}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;