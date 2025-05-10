import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${yourAuthToken}` // Add token here if needed
  },
  withCredentials: true,
  validateStatus: status => status < 600
});

export default axiosInstance;
