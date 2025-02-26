import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Post = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/stories")
        .then(response => setStories(response.data))
        .catch(error => console.error("Error fetching stories:", error));
}, []);


  return (
    <div>
      <h2>Stories</h2>
            {stories.map((story, index) => (
                <div key={index}>
                    <h3>{story.user.name}</h3>
                    <p>{story.user.description}</p>
                    <p>{story.story}</p>
                </div>
            ))}
    </div>
  )
}

export default Post
