import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || 'https://weave-story-b.onrender.com/api';

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/v1/login`, { email, password });
  return response.data; 
};

export const signupUser = async ({ name, email, password }) => {
  const response = await axios.post(`${API_URL}/v1/signup`, { name, email, password });
  return response.data; 
};

export const verifyUser = async ({ verificationCode }) => {
  const response = await axios.post(`${API_URL}/v1/verifyEmail`, {
    verificationCode
  });
  return response.data;
}