const StoryAddSection = ({
  story,
  storyInputs,
  setStoryInputs,
  colorInputs,
  setColorInputs,
  handleAdd,
}) => {
  return (
    <div className="my-4 flex flex-col md:flex-row gap-2 items-center">
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
      />
      <input
        type="color"
        value={colorInputs[story._id] || "#aabbcc"}
        onChange={(e) =>
          setColorInputs((prev) => ({
            ...prev,
            [story._id]: e.target.value,
          }))
        }
        className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAdd(story._id);
        }}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
      >
        Add
      </button>
    </div>
  );
};

export default StoryAddSection;
