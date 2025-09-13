import { useEffect, useState } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import {
  postLikeToAppendedContent,
  postLikeToMainContent,
  postCommentToAppendedContent,
  postCommentToMainContent,
  getLikesOfMainContent,
  getLikesOfAppendedContent,
  getCommentsOfMainContent,
  getCommentsOfAppendedContent,
} from "../../../Utils/api/api";

const ReactionBar = ({ user, type, contentId }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [showLikesList, setShowLikesList] = useState(false);
  const [showCommentsList, setShowCommentsList] = useState(false);

  // ---- Fetch likes & comments ----
  const fetchData = async () => {
    if (!contentId) return;
    try {
      if (type === "main") {
        const likeRes = await getLikesOfMainContent(contentId);
        const commentRes = await getCommentsOfMainContent(contentId);
        setLikes(likeRes.likes || []);
        setComments(commentRes.comments || []);
      } else {
        const likeRes = await getLikesOfAppendedContent(contentId);
        const commentRes = await getCommentsOfAppendedContent(contentId);
        setLikes(likeRes.likes || []);
        setComments(commentRes.comments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, contentId]);

  // ---- Post Like ----
  const postLike = async () => {
    try {
      if (type === "main") {
        await postLikeToMainContent(user.id, contentId);
      } else {
        await postLikeToAppendedContent(user.id, contentId);
      }
      fetchData(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Post Comment ----
  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      if (type === "main") {
        await postCommentToMainContent(user.id, contentId, commentText);
      } else {
        await postCommentToAppendedContent(user.id, contentId, commentText);
      }
      setCommentText("");
      setShowCommentInput(false);
      fetchData(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Reactions Row */}
      <div className="flex gap-4 items-center">
        {/* Like */}
        <div className="flex items-center cursor-pointer gap-1">
          <FaHeart
            onClick={postLike}
            className={likes?.some((u) => u._id === user.id) ? "text-red-500" : "text-gray-400"}
          />
          <span onClick={() => setShowLikesList((p) => !p)}>{likes?.length ?? 0}</span>
        </div>

        {/* Comment */}
        <div className="flex items-center cursor-pointer gap-1">
          <FaRegComment
            onClick={() => setShowCommentInput((p) => !p)}
            className="text-gray-400"
          />
          <span onClick={() => setShowCommentsList((p) => !p)}>{comments?.length ?? 0}</span>
        </div>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="flex flex-col mt-2 gap-2">
          <textarea
            className="border rounded p-2 w-full"
            rows={3}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={postComment}
            >
              Post
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => setShowCommentInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Likes List */}
      {showLikesList && (
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm font-semibold mb-1">Liked by:</p>
          {likes?.length === 0 ? (
            <p className="text-xs text-gray-500">No likes yet</p>
          ) : (
            likes.map((u) => (
              <div key={u._id} className="text-sm">
                {u.name || u._id}
              </div>
            ))
          )}
        </div>
      )}

      {/* Comments List */}
      {showCommentsList && (
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm font-semibold mb-1">Comments:</p>
          {comments?.length === 0 ? (
            <p className="text-xs text-gray-500">No comments yet</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="text-sm">
                <strong>{c.user?.name || c.user?._id}</strong>: {c.comment}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionBar;
