import { useState } from "react";
import AppendCard from "./AppendCard";
import { toPastel } from "../../../Utils/colorUtils";
import useOpenAccount from "../../../Hooks/useOpenAccount";
import { deleteContent } from "../../../Utils/api/story.api";
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
      setShowAppends(true);
    } catch (error) {
      console.error("Error appending to story: ", error);
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("This action cannot be undone. Delete this content?")) return;
    try {
      const res = await deleteContent({ contentId, userId: user.id });
      console.log(res);
    } catch (error) {
      console.log("Error deleting the content: ", error);
    }
  }

  const enhancedColor = `${toPastel(story.color) || "#ffffff"}99`;

  return (
    <div
      className="rounded-2xl p-5 shadow-xl border border-white/20 backdrop-blur-md transition hover:shadow-2xl"
      style={{ backgroundColor: enhancedColor }}
    >
      <div className="mb-3">
        <p className="text-gray-900 text-base leading-relaxed mb-2">{story.content}</p>
        <div className="flex flex-wrap justify-between mb-2">
          {story.genres.map((genre, index) => (
            <span
              key={index}
              className="text-pink-500 bg-white/100 hover:bg-white/50 px-2 py-1 rounded-full text-xs cursor-pointer backdrop-blur-sm"
            >
              {genre}
            </span>
          ))}

          {user.id === story.user._id && (
            <button 
              className="text-white bg-red-600 hover:bg-red-500/100 px-2 py-1 rounded-full text-xs cursor-pointer backdrop-blur-sm" 
              onClick={() => handleDelete(story._id)}
            >
                Delete
            </button>
          )}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span
            onClick={(e) => {
              e.stopPropagation();
              openAccount(story.user._id);
            }}
            className="hover:underline cursor-pointer font-semibold text-gray-900"
          >
            {story.user.name}
          </span>
          <p>Created on {new Date(story.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <ReactionBar user={user} type="main" contentId={story._id}/>

      <div className="my-4 flex flex-col md:flex-row gap-2 items-center">
        <textarea
          className="border border-white/30 rounded-lg p-3 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/20 placeholder-gray-600 text-gray-900 backdrop-blur-sm"
          rows={3}
          placeholder="Add to this story..."
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
        />
        <input
          type="color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          className="w-16 h-12 rounded-lg cursor-pointer border border-white/40"
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
            className="text-sm text-pink-500 hover:underline"
          >
            {showAppends
              ? `Hide ${story.appendedContents.length} Appends`
              : `Show ${story.appendedContents.length} Appends`}
          </button>
          {showAppends && (
            <AppendCard
              appends={story.appendedContents}
              reloadStories={reloadStories}
              storyId={story.user._id}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
