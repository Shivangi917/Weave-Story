import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "https://weave-story-b.onrender.com/api";

export const fetchUserById = async (userId) => {
  const response = await fetch(`${API_URL}/v1/users/${userId}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

export const toggleFollowUser = async ({ userId, currentUserId }) => {
  try {
    const response = await axios.patch(`${API_URL}/v1/users/${currentUserId}/follow/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error;
  }
};
