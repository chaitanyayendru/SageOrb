import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
  uploadData: (formData) => axios.post(`${API_URL}/upload-data`, formData),
  getProjection: (data) => axios.post(`${API_URL}/liquidity-projection`, { data }),
  getOptimization: (data) => axios.post(`${API_URL}/optimize`, { data })
};

export default api;
