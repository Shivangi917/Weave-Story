import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Create = ({ loggedInUser }) => {
  const [story, setStory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert("You must be logged in to post a story.");
      return;
    }

    try {
        await axios.post('http://localhost:3000/api/create', {
            userId: loggedInUser?.id,
            name: loggedInUser?.name,
            story,
        });
        alert("Weaved successfully");
        navigate('/');
    } catch (error) {
        console.error('Error creating story: ', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <input 
            placeholder='Weave something'
            type='text'
            value={story}
            onChange={(e) => setStory(e.target.value)}
        />
        <button type='submit'>Post</button>
    </form>
  )
}

export default Create
