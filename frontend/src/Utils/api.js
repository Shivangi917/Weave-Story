import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);
  return response.data;
};

export const createStory = async ({ userId, name, story, color, genres }) => {
  const response = await axios.post(`${API_URL}/create`, {
    userId,
    name,
    story,
    color,
    genres
  });
  return response.data;
};

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

export const deleteStory = async ({ storyId, appendedIndex = null, userId }) => {
  const response = await axios.post(`${API_URL}/deleteStory`, {
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

  const res = await fetch(`${API_URL}/stories/filter?${query.toString()}`, { credentials: 'include' });
  return await res.json();
};

export const loadPersonalStories = async (userId) => {
  const response = await axios.get(`${API_URL}/stories/user/${userId}`);
  return response.data;
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, { credentials: 'include' });
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

export const likeStory = (storyId, body) =>
  axios.post(`${API_URL}/stories/${storyId}/like`, body).then(res => res.data);

export const commentStory = (storyId, body) =>
  axios.post(`${API_URL}/stories/${storyId}/comment`, body).then(res => res.data);

export const getStoryLikes = (storyId) =>
  axios.get(`${API_URL}/stories/${storyId}/like`).then(res => res.data);

export const getStoryComments = (storyId) =>
  axios.get(`${API_URL}/stories/${storyId}/comment`).then(res => res.data);

export const likeAppendedStory = (storyId, appendedId, body) =>
  axios.post(`${API_URL}/stories/${storyId}/appended/${appendedId}/like`, body).then(res => res.data);

export const commentAppendedStory = (storyId, appendedId, body) =>
  axios.post(`${API_URL}/stories/${storyId}/appended/${appendedId}/comment`, body).then(res => res.data);

export const getAppendedStoryLikes = (storyId, appendedId) =>
  axios.get(`${API_URL}/stories/${storyId}/appended/${appendedId}/like`).then(res => res.data);

export const getAppendedStoryComments = (storyId, appendedId) =>
  axios.get(`${API_URL}/stories/${storyId}/appended/${appendedId}/comment`).then(res => res.data);

export const lockAppendedStory = ({ storyId, appendedIndex, lock }) => {
  return axios.post(`${API_URL}/appendedStory/lock`, { storyId, appendedIndex, lock });
};
