import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Change this if your backend is hosted elsewhere

export const createCategory = async (name) => {
  const response = await axios.post(`${API_BASE_URL}/categories`, { name });
  return response.data;
};
