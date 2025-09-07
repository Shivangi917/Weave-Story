import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const likeAppendedStory = (storyId, appendedId, body) =>
  axios.post(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/like`, body).then((res) => res.data);

export const commentAppendedStory = (storyId, appendedId, body) =>
  axios.post(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/comment`, body).then((res) => res.data);

export const getAppendedStoryLikes = (storyId, appendedId) =>
  axios.get(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/like`).then((res) => res.data);

export const getAppendedStoryComments = (storyId, appendedId) =>
  axios.get(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/comment`).then((res) => res.data);

export const lockAppendedStory = ({ storyId, appendedIndex, lock }) => {
  return axios.post(`${API_URL}/v1/appendedStory/lock`, { storyId, appendedIndex, lock });
};

export const editAppendedStory = (storyId, appendedId, body) => {
  return axios
    .post(`${API_URL}/v1/stories/${storyId}/appended/${appendedId}/edit`, body)
    .then((res) => res.data);
};
