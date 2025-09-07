import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const getActivities = (userId) => {
  return axios.get(`${API_URL}/v1/activity`, { params: { userId } });
};

export const markActivitySeen = (id) => {
  return axios.patch(`${API_URL}/v1/activity/${id}/seen`);
};
