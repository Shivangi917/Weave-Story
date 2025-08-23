import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext"; 

const Create = () => {
  const [story, setStory] = useState('');
  const [color, setColor] = useState('#ffffff');
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to post a story.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/create', {
        userId: user?.id,
        name: user?.name,
        story,
        color,
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
          <label className="mb-2 font-medium text-sm">Pick your vibe color:</label>
          <input
            type="color"
            className="w-16 h-10 p-1 mb-4 cursor-pointer border rounded"
            value={color}
            onChange={(e) => setColor(e.target.value)}
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