import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { 
  appendStory, 
  deleteStory, 
  getFilteredStories, 
  likeStory, 
  commentStory, 
  getStoryLikes, 
  getStoryComments,
  likeAppendedStory,
  commentAppendedStory,
  getAppendedStoryLikes,
  getAppendedStoryComments
} from "../../Utils/api";
import StoryCard from "./StoryCard";
import { toPastel } from "../../Utils/colorUtils";

const PostList = ({ filter = "recent" }) => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [expandedCommentSection, setExpandedCommentSection] = useState(null);
  const [storyInputs, setStoryInputs] = useState({});
  const [colorInputs, setColorInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likesModal, setLikesModal] = useState(null);
  const [commentsModal, setCommentsModal] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    loadStories(filter);
  }, [filter]);

  const loadStories = async (filterObj) => {
    try {
      const { type, genre, search } = filterObj || {};
      const data = await getFilteredStories(type, genre, search);
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
        stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            user={user}
            expandedStoryId={expandedStoryId}
            expandedCommentSection={expandedCommentSection}
            toggleStory={setExpandedStoryId}
            toggleCommentInput={setExpandedCommentSection}
            handleLike={handleLike}
            handleDelete={handleDelete}
            handleComment={handleComment}
            showLikes={showLikes}
            showComments={showComments}
            canDeleteStory={canDeleteStory}
            canDeleteAppended={canDeleteAppended}
            storyInputs={storyInputs}
            setStoryInputs={setStoryInputs}
            colorInputs={colorInputs}
            setColorInputs={setColorInputs}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            handleAdd={handleAdd}
          />
        ))
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

export default PostList;
