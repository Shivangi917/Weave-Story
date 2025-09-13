import { useState } from "react";
import AppendCard from "./AppendCard";
import { toPastel } from "../../../Utils/colorUtils";
import useOpenAccount from "../../../Hooks/useOpenAccount";
import { appendContent } from "../../../Utils/api/api";
import { useAuth } from "../../../Context/AuthContext";
import ReactionBar from "../Reaction/ReactionBar";

const ContentCard = ({ story, reloadStories }) => {
  const openAccount = useOpenAccount();
  const { user } = useAuth();

  const [contentInput, setContentInput] = useState("");
  const [colorInput, setColorInput] = useState("#aabbcc");
  const [showAppends, setShowAppends] = useState(false);

  const handleAdd = async (contentId) => {
    if (!contentInput.trim()) return alert("Append cannot be empty");

    try {
      await appendContent(contentId, {
        userId: user?.id,
        content: contentInput,
        color: toPastel(colorInput),
        type: "content",
      });

      setContentInput("");
      setColorInput("#aabbcc");
      reloadStories();
      setShowAppends(true);
    } catch (error) {
      console.error("Error appending to story: ", error);
    }
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ backgroundColor: toPastel(story.color) || "#ffffff" }}
    >
      <div className="mb-1">
        <p className="text-gray-800 text-base leading-relaxed mb-2">{story.content}</p>
        <div className="flex flex-wrap gap-2">
          {story.genres.map((genre, index) => (
            <span
              key={index}
              className="text-pink-500 hover:text-pink-700 text-sm bg-white px-2 py-1 rounded cursor-pointer"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex justify-between mt-1">
          <span
            onClick={(e) => {
              e.stopPropagation();
              openAccount(story.user._id);
            }}
            className="text-sm text-black transition hover:underline cursor-pointer"
          >
            {story.user.name}
          </span>
          <p className="text-gray-600 text-sm">
            Created on {new Date(story.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <ReactionBar user={user} type="main" contentId={story._id}/>

      <div className="my-4 flex flex-col md:flex-row gap-2 items-center">
        <textarea
          className="border border-green-300 rounded-lg p-3 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows={3}
          placeholder="Add to this story..."
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
        />
        <input
          type="color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
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

      {story.appendedContents?.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowAppends(!showAppends)}
            className="text-sm text-pink-600 hover:underline"
          >
            {showAppends
              ? `Hide ${story.appendedContents.length} Appends`
              : `Show ${story.appendedContents.length} Appends`}
          </button>
          {showAppends && (
            <AppendCard
              appends={story.appendedContents}
              reloadStories={reloadStories}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
