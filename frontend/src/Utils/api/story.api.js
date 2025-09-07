import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const fetchStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);
  return response.data;
};

export const createStory = async ({ userId, name, content, color, genres }) => {
  const response = await axios.post(`${API_URL}/v1/create`, {
    userId,
    name,
    content,
    color,
    genres
  });
  return response.data;
};

export const appendStory = async ({ storyId, userId, name, content, color }) => {
  const response = await axios.post(`${API_URL}/v1/appendStory`, {
    storyId,
    userId,
    name,
    content,
    color,
  });
  return response.data;
};

export const deleteStory = async ({ storyId, appendedIndex = null, userId }) => {
  const response = await axios.post(`${API_URL}/v1/deleteStory`, {
    storyId,
    appendedIndex,
    userId,
  });
  return response.data;
};

export const getFilteredStories = async (type, genre, search) => {
  const query = new URLSearchParams();
  if (type) query.append("type", type);
  if (genre) query.append("genre", genre);
  if (search) query.append("search", search);

  const res = await fetch(`${API_URL}/v1/stories/filter?${query.toString()}`, { credentials: 'include' });
  return await res.json();
};

export const loadPersonalStories = async (userId) => {
  const response = await axios.get(`${API_URL}/v1/stories/user/${userId}`);
  return response.data;
};