import React from 'react';
import Genres from '../Genres/Genres';
import Post from '../Post/Post';
import Account from '../Account/Account';

const Home = ({ loggedIn, loggedInUser }) => {
  return (
    <div className="flex justify-between">
      <div>
        <Genres />
      </div>
      <div>
        {loggedIn ? (
          <Post loggedInUser={loggedInUser} />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to the Storytelling Platform!
            </h2>
            <p className="text-gray-600">Log in to explore and contribute to amazing stories.</p>
          </div>
        )}
      </div>
      {loggedIn ? <Account loggedInUser={loggedInUser} /> : <p></p>}
    </div>
  );
};

export default Home;
