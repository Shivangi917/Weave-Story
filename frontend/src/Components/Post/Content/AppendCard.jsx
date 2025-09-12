import { useState } from "react";
import CommentSection from "./CommentSection";
import { toPastel } from "../../../Utils/colorUtils";
import { appendContent } from "../../../Utils/api/api";
import { useAuth } from "../../../Context/AuthContext";

const AppendCard = ({ appends, level = 0, reloadStories }) => {
  const { user } = useAuth();

  if (!appends || appends.length === 0) return null;

  return (
    <>
      {appends.map((append) => (
        <SingleAppend
          key={append._id}
          append={append}
          level={level}
          user={user}
          reloadStories={reloadStories}
        />
      ))}
    </>
  );
};

const SingleAppend = ({ append, level, user, reloadStories }) => {
  const [input, setInput] = useState("");
  const [color, setColor] = useState("#aabbcc");
  const [showChildAppends, setShowChildAppends] = useState(false);

  const handleAdd = async (appendId) => {
    if (!input.trim()) return alert("Append cannot be empty");

    try {
      await appendContent(appendId, {
        userId: user?.id,
        content: input,
        color: toPastel(color),
        type: "append",
      });
      setInput("");
      setColor("#aabbcc");
      reloadStories(); // refresh all stories
      setShowChildAppends(true); // expand new append
    } catch (error) {
      console.error("Error appending: ", error);
    }
  };

  return (
    <div
      className="rounded-md p-3 my-2 border-l-2 border-gray-200"
      style={{
        backgroundColor: append.color || "#f8f9fa",
        marginLeft: level > 0 ? `${level}rem` : 0,
      }}
    >
      {/* Append content */}
      <div className="mb-2">
        <p className="text-gray-700 text-sm mb-1">{append.content || "No Content"}</p>
        <p className="text-gray-500 text-xs italic">By: {append.user?.name}</p>
      </div>

      {/* Add child append */}
      <div className="my-2 flex flex-col md:flex-row gap-2 items-center">
        <textarea
          className="border border-green-300 rounded-lg p-2 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows={2}
          placeholder="Add to this append..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-8 rounded-lg cursor-pointer border border-gray-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd(append._id);
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg transition text-sm"
        >
          Add
        </button>
      </div>

      {/* Toggle child appends */}
      {append.appendedContents?.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowChildAppends(!showChildAppends)}
            className="text-sm text-pink-600 hover:underline"
          >
            {showChildAppends
              ? `Hide ${append.appendedContents.length} Appends`
              : `Show ${append.appendedContents.length} Appends`}
          </button>
          {showChildAppends && (
            <AppendCard
              appends={append.appendedContents}
              level={level + 1}
              reloadStories={reloadStories}
            />
          )}
        </div>
      )}

      {/* Comments */}
      <CommentSection comments={append.comments} />
    </div>
  );
};

export default AppendCard;
