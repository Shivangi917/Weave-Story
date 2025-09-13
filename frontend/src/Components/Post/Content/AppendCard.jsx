import { useState } from "react";
import { toPastel } from "../../../Utils/colorUtils";
import { appendContent, deleteAppend, lockAppend } from "../../../Utils/api/api";
import { useAuth } from "../../../Context/AuthContext";
import ReactionBar from "../Reaction/ReactionBar";
import useOpenAccount from "../../../Hooks/useOpenAccount";

const AppendCard = ({ appends, level = 0, reloadStories, storyId }) => {
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
          storyId={storyId}
        />
      ))}
    </>
  );
};

const SingleAppend = ({ append, level, user, reloadStories, storyId }) => {
  const [input, setInput] = useState("");
  const [color, setColor] = useState("#aabbcc");
  const [showChildAppends, setShowChildAppends] = useState(false);

  const openAccount = useOpenAccount();

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
      reloadStories();
      setShowChildAppends(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLock = async (appendId) => {
    try {
      const response = await lockAppend(appendId, user.id);
      if (response.message) {
        reloadStories();
      }
    } catch (err) {
      console.error("Lock error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to lock/unlock");
    }
  };

  const handleDelete = async (appendId) => {
    try {
      const response = await deleteAppend(appendId, user.id);
      if (response.message) {
        reloadStories();
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const canDelete = !append.locked || append.user?._id === user.id || user.id === storyId;
  const canLock = user.id === storyId || append.parentContentOwner === user.id || append.parentAppendOwner === user.id;

  const enhancedColor = `${append.color || "#f8f9fa"}99`;

  return (
    <div
      className="rounded-xl p-4 my-3 border border-white/20 shadow-lg backdrop-blur-md transition hover:shadow-xl"
      style={{
        backgroundColor: enhancedColor,
        marginLeft: level > 0 ? `${level}rem` : 0,
      }}
    >
      <div className="mb-2">
        <p className="text-gray-800 text-sm mb-1">{append.content || "No Content"}</p>

        <div className="flex gap-2">
          {canDelete && (
            <button
              className="text-white bg-red-600 hover:bg-red-500 px-2 py-1 rounded-full text-xs"
              onClick={() => handleDelete(append._id)}
            >
              {append.locked && append.user?._id !== user.id ? "Remove Me" : "Delete"}
            </button>
          )}
          {canLock && (
            <button
              className={`text-white px-2 py-1 rounded-full text-xs ${append.locked ? "bg-gray-600" : "bg-orange-500"}`}
              onClick={() => handleLock(append._id)}
            >
              {append.locked ? "Unlock" : "Lock"}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
          <span
            onClick={(e) => { e.stopPropagation(); openAccount(append.user?._id); }}
            className="hover:underline cursor-pointer font-semibold text-gray-900"
          >
            {append.user?.name || "Anonymous"}
          </span>
          <p>Created on {new Date(append.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <ReactionBar user={user} type="append" contentId={append._id} />

      <div className="my-2 flex flex-col md:flex-row gap-2 items-center">
        <textarea
          className="border border-white/30 rounded-lg p-2 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/20 placeholder-gray-600 text-gray-900 backdrop-blur-sm"
          rows={2}
          placeholder="Add to this append..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-8 rounded-lg cursor-pointer border border-white/40"
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

      {append.appendedContents?.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowChildAppends(!showChildAppends)}
            className="text-sm text-pink-500 hover:underline"
          >
            {showChildAppends ? `Hide ${append.appendedContents.length} Appends` : `Show ${append.appendedContents.length} Appends`}
          </button>
          {showChildAppends && (
            <AppendCard
              appends={append.appendedContents}
              level={level + 1}
              reloadStories={reloadStories}
              storyId={storyId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AppendCard;
