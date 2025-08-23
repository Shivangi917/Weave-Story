import React from "react";
import Genres from "../Genres/Genres";
import Post from "../Post/Post";
import Account from "../Account/Account";
import { useAuth } from "../Context/AuthContext"; 

const Home = () => {
  const { user } = useAuth(); 

  return (
    <div className="flex justify-between">
      <div>
        <Genres />
      </div>
      <div>
        {user ? (
          <Post loggedInUser={user} />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to the Storytelling Platform!
            </h2>
            <p className="text-gray-600">
              Log in to explore and contribute to amazing stories.
            </p>
          </div>
        )}
      </div>
      {user ? <Account /> : <p></p>}
    </div>
  );
};

export default Home;
