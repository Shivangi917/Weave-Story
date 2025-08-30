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
  getAppendedStoryComments,
  lockAppendedStory
} from "../../Utils/api";
import StoryCard from "./StoryCard";
import { toPastel } from "../../Utils/colorUtils";
import { useNavigate } from "react-router-dom";
import ReactionModals from "./ReactionModals";

const PostList = ({ filter = "recent", stories: externalStories = null, hideHeader = false }) => {
  const [stories, setStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const [expandedCommentSection, setExpandedCommentSection] = useState(null);
  const [storyInputs, setStoryInputs] = useState({});
  const [colorInputs, setColorInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likesModal, setLikesModal] = useState(null);
  const [commentsModal, setCommentsModal] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!externalStories) {
      loadStories(filter);
    } else {
      setStories(externalStories);
    }
  }, [filter, externalStories]);

  const openAccount = (userId) => navigate(`/account/${userId}`);

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
        await likeStory(storyId, { userId: user.id ,name: user.name});
      } else {
        await likeAppendedStory(storyId, appendedId, { userId: user.id, name: user.name });
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
      setLikesModal(res.data.likes);
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
      setCommentsModal(res.data.comments);
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
      const res = await deleteStory({ storyId, appendedIndex, userId: user?.id });

      if (res.locked) {
        setStories(prev =>
          prev.map(story => {
            if (story._id !== storyId) return story;
            const newAppended = [...story.appendedBy];
            newAppended[appendedIndex] = {
              ...newAppended[appendedIndex],
              name: undefined
            };
            return { ...story, appendedBy: newAppended };
          })
        );
      } else {
        await loadStories(filter);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete. You may not have permission.");
    }
  };


  const handleLockToggle = async (storyId, appendedIndex, lock) => {
    try {
      await lockAppendedStory({ storyId, appendedIndex, lock });
      await loadStories(filter);
    } catch (err) {
      console.error(err);
    }
  };

  const normalizeId = (id) => (id ? id.toString() : "");

  const canDeleteStory = (story) => user && normalizeId(story.user._id) === normalizeId(user.id);

  const canDeleteAppended = (story, appended) => 
  user && (normalizeId(story.user._id) === normalizeId(user.id) || normalizeId(appended.user._id) === normalizeId(user.id));

  const canLock = (story) => user && story.user._id === user.id;

  return (
    <div className="max-w-3xl mx-auto">
      {!hideHeader && (
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          🌟 Stories
        </h2>
      )}

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
            handleLockToggle={handleLockToggle}
            handleComment={handleComment}
            showLikes={showLikes}
            showComments={showComments}
            canDeleteStory={canDeleteStory}
            canDeleteAppended={canDeleteAppended}
            canLock={canLock}
            storyInputs={storyInputs}
            setStoryInputs={setStoryInputs}
            colorInputs={colorInputs}
            setColorInputs={setColorInputs}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            handleAdd={handleAdd}
            openAccount={openAccount}
          />
        ))
      )}

      <ReactionModals
        likesModal={likesModal}
        commentsModal={commentsModal}
        closeLikes={() => setLikesModal(null)}
        closeComments={() => setCommentsModal(null)}
        openAccount={openAccount}
      />

    </div>
  );
};

export default PostList;
