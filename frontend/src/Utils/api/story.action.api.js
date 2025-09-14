import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

// ---- Likes ----
export const getLikesOfMainContent = async (contentId) => {
  const res = await axios.get(`${API_URL}/story-actions/content/${contentId}/likes`);
  return res.data;
};

export const getLikesOfAppendedContent = async (appendId) => {
  const res = await axios.get(`${API_URL}/story-actions/appended/${appendId}/likes`);
  return res.data;
};

export const postLikeToMainContent = async (userId, contentId) => {
  const res = await axios.post(`${API_URL}/story-actions/content/${contentId}/like`, { userId });
  return res.data;
};

export const postLikeToAppendedContent = async (userId, appendId) => {
  const res = await axios.post(`${API_URL}/story-actions/appended/${appendId}/like`, { userId });
  return res.data;
};

// ---- Comments ----
export const getCommentsOfMainContent = async (contentId) => {
  const res = await axios.get(`${API_URL}/story-actions/content/${contentId}/comments`);
  return res.data;
};

export const getCommentsOfAppendedContent = async (appendId) => {
  const res = await axios.get(`${API_URL}/story-actions/appended/${appendId}/comments`);
  return res.data;
};

export const postCommentToMainContent = async (userId, contentId, comment) => {
  const res = await axios.post(`${API_URL}/story-actions/content/${contentId}/comment`, { userId, comment });
  return res.data;
};

export const postCommentToAppendedContent = async (userId, appendId, comment) => {
  const res = await axios.post(`${API_URL}/story-actions/appended/${appendId}/comment`, { userId, comment });
  return res.data;
};
