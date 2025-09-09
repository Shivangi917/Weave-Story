import { motion } from "framer-motion";
import { toPastel } from "../../../Utils/colorUtils";
import StoryHeader from "./StoryHeader";
import StoryActions from "./StoryActions";
import CommentBox from "../Comment/CommentBox";
import AppendedThread from "../Append/AppendedThread";
import StoryAddSection from "./StoryAddSection";

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
  return (
    <motion.div
      key={story._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ background: toPastel(story.color) }}
      className="p-5 shadow-lg rounded-xl mb-6 border border-green-200"
    >
      <StoryHeader story={story} openAccount={openAccount} />

      <StoryActions
        story={story}
        user={user}
        expandedCommentSection={expandedCommentSection}
        toggleCommentInput={toggleCommentInput}
        showLikes={showLikes}
        showComments={showComments}
        handleLike={handleLike}
        handleDelete={handleDelete}
        canDeleteStory={canDeleteStory}
      />

      <CommentBox
        storyId={story._id}
        appendedId={null}
        commentKey={`${story._id}-root`}
        commentInputs={commentInputs}
        setCommentInputs={setCommentInputs}
        handleComment={handleComment}
      />

      <AppendedThread 
        story={story}
        toggleStory={toggleStory}
        user={user}
        expandedStoryId={expandedStoryId}
        expandedCommentSection={expandedCommentSection}
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

      <StoryAddSection
        story={story}
        storyInputs={storyInputs}
        setStoryInputs={setStoryInputs}
        colorInputs={colorInputs}
        setColorInputs={setColorInputs}
        handleAdd={handleAdd}
      />
    </motion.div>
  );
};

export default StoryCard;
