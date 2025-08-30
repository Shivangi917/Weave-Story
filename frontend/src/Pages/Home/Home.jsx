import Genres from "../../Components/Genres/Genres";
import PostList from "../../Components/Post/PostList";
import { useAuth } from "../../Context/AuthContext";
import LoadStory from "../LoadStory/LoadStory";
import { useState } from "react";

const Home = () => {
  const [filter, setFilter] = useState({ type: "random", genre: null, search: "" });
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-4 gap-6 p-6 min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      {user && (
        <div className="col-span-1">
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Genres
            </h3>
            <Genres
              onSelectGenre={(genreName) => setFilter((prev) => ({ ...prev, genre: genreName }))}
            />
          </div>
        </div>
      )}

      <div className="col-span-2">
        <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          {user ? (
            <PostList filter={filter} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Welcome to the Storytelling Platform! ✨
              </h2>
              <p className="text-gray-600 text-center">
                Log in to explore and contribute to amazing stories.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1">
        <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <LoadStory filter={filter} setFilter={setFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
