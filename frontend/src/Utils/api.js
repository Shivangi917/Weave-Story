import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Fetch all stories
export const fetchStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);
  return response.data;
};

// Create a new story
export const createStory = async ({ userId, name, story, color }) => {
  const response = await axios.post(`${API_URL}/create`, {
    userId,
    name,
    story,
    color,
  });
  return response.data;
};

// Append to an existing story
export const appendStory = async ({ storyId, userId, name, story, color }) => {
  const response = await axios.post(`${API_URL}/appendStory`, {
    storyId,
    userId,
    name,
    story,
    color,
  });
  return response.data;
};

// Delete story or appended segment
export const deleteStory = async ({ storyId, appendedIndex = null, userId }) => {
  const response = await axios.post(`${API_URL}/deleteStory`, {
    storyId,
    appendedIndex,
    userId,
  });
  return response.data;
};
