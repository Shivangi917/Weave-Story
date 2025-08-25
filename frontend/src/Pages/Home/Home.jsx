import Genres from "../../Components/Genres/Genres";
import Post from "../../Components/Post/Post";
import { useAuth } from "../../Context/AuthContext";
import LoadStory from "../LoadStory/LoadStory";
import { useState } from "react";
import { getFilteredStories } from '../../Utils/api';

const Home = () => {
  const [stories, setStories] = useState([]);
  const { user } = useAuth();

  const loadStories = async (type) => {
    const result = await getFilteredStories(type);
    setStories(result);
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6 min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      {user && (
        <div className="col-span-1">
          <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Genres
            </h3>
            <Genres compact />
          </div>
        </div>
      )}

      <div className="col-span-2">
        <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          {user ? (
            <Post defaultFilter="recent" />
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
          <LoadStory loadStories={loadStories} />
        </div>
      </div>
    </div>
  );
};

export default Home;
