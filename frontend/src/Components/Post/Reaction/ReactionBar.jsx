import { FaHeart, FaRegComment } from "react-icons/fa";

const ReactionBar = ({
  likes,
  comments,
  liked,
  onLike,
  onShowLikes,
  onComment,
  onShowComments,
  size = 20,
}) => {
  return (
    <div className="flex gap-5 items-center mt-2">
      <div className="flex items-center gap-1">
        <div className="cursor-pointer" onClick={onLike}>
          <FaHeart size={size} className={liked ? "text-red-500" : "text-gray-400"} />
        </div>
        <span className="cursor-pointer" onClick={onShowLikes}>
          {likes.length}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <div className="cursor-pointer" onClick={onComment}>
          <FaRegComment size={size - 2} className="text-black" />
        </div>
        <span className="cursor-pointer" onClick={onShowComments}>
          {comments.length}
        </span>
      </div>
    </div>
  );
};

export default ReactionBar;