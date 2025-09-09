const StoryHeader = ({ story, openAccount }) => {
  return (
    <div>
      <p className="group text-xl font-semibold text-gray-800">
        {story.content}
      </p>

      <div className="flex flex-wrap gap-2 my-2">
        {story.genres.map((genre, index) => (
          <span
            key={index}
            className="text-pink-500 hover:text-pink-700 text-sm bg-white px-2 py-1 rounded"
          >
            {genre}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span
          onClick={(e) => {
            e.stopPropagation();
            openAccount(story.user._id);
          }}
          className="text-sm text-black mt-1 transition block hover:underline cursor-pointer"
        >
          {story.user.name}
        </span>
        <span className="text-xs text-gray-600 mt-1">
          Created on {new Date(story.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default StoryHeader;
