import { useState } from "react";
import { motion } from "framer-motion";
import { toPastel } from "../../../Utils/colorUtils";
import ReactionBar from "../Reaction/ReactionBar";
import EditControls from "../EditControls";
import AppendedMeta from "./AppendedMeta";
import CommentBox from "../Comment/CommentBox";

const AppendedItem = ({
  appended,
  index,
  story,
  user,
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

  const appendedLiked = user ? appended.likes.includes(user.id) : false;
  const commentKey = `${story._id}-${appended._id}`;
  const isLastAppend = index === story.appendedBy.length - 1;
  const canEdit = isLastAppend && user && user.id === appended.user._id;

  return (
    <motion.div
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
                  [`edit-${commentKey}`]: appended.content,
                }));
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mb-1"
            >
              Edit
            </button>
          )}

          {editingId === appended._id ? (
            <EditControls
              appended={appended}
              commentKey={commentKey}
              commentInputs={commentInputs}
              setCommentInputs={setCommentInputs}
              handleEdit={handleEdit}
              storyId={story._id}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <p>{appended.content}</p>
          )}

          <AppendedMeta appended={appended} openAccount={openAccount} />
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

      {/* ---- Lock ---- */}
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
        <CommentBox
          storyId={story._id}
          appendedId={appended._id}
          commentKey={commentKey}
          commentInputs={commentInputs}
          setCommentInputs={setCommentInputs}
          handleComment={handleComment}
        />
      )}
    </motion.div>
  );
};

export default AppendedItem;
