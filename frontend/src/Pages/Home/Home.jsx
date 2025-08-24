import React from "react";
import Genres from "../../Components/Genres/Genres";
import Post from "../../Components/Post/Post";
import Account from "../../Components/Account/Account";
import { useAuth } from "../../Context/AuthContext"; 

const Home = () => {
  const { user } = useAuth(); 

  return (
    <div className="grid grid-cols-4 gap-6 p-6 min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      {user ? (
        <div className="col-span-1">
          <Genres compact />
        </div>
      ) : (
        <></>
      )}

      <div className="col-span-2">
        {user ? (
          <Post loggedInUser={user} />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Welcome to the Storytelling Platform! ✨
            </h2>
            <p className="text-gray-600">
              Log in to explore and contribute to amazing stories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
