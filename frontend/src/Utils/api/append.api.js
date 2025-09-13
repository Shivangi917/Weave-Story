import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const editAppendedStory = (storyId, appendedId, body) => {
  return axios
    .post(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/edit`, body)
    .then((res) => res.data);
};

//--------------NEW----------------------------------------

export const appendContent = (parentId, data) => {
  return axios.post(`${API_URL}/append/content/${parentId}`, data);
};

export const deleteAppend = async (appendId, userId) => {
  const res = await axios.post(`${API_URL}/append/delete`, { appendId, userId });
  return res.data;
};

export const lockAppend = async (appendId, userId) => {
  // Make sure we send appendId and userId in the request body
  const res = await axios.post(`${API_URL}/append/lock`, { appendId, userId });
  return res.data;
};