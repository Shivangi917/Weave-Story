const CommentSection = ({ comments }) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <h4 className="text-gray-700 font-medium text-sm mb-2">Comments:</h4>
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment._id} className="text-sm">
            <p className="text-gray-800">
              <strong className="text-gray-700">{comment.name}:</strong> 
              <span className="ml-1">{comment.comment}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;