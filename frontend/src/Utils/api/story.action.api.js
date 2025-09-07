import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const likeStory = (storyId, body) =>
  axios.post(`${API_URL}/v1/stories/${storyId}/like`, body).then((res) => res.data);

export const commentStory = (storyId, body) =>
  axios.post(`${API_URL}/v1/stories/${storyId}/comment`, body).then((res) => res.data);

export const getStoryLikes = (storyId) =>
  axios.get(`${API_URL}/v1/stories/${storyId}/like`).then((res) => res.data);

export const getStoryComments = (storyId) =>
  axios.get(`${API_URL}/v1/stories/${storyId}/comment`).then((res) => res.data);