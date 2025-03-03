import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create = ({ loggedInUser }) => {
  const [story, setStory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert('You must be logged in to post a story.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/create', {
        userId: loggedInUser?.id,
        name: loggedInUser?.name,
        story,
      });
      alert('Weaved successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating story: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">Weave Your Story</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            placeholder="Weave something..."
            className="border border-green-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;