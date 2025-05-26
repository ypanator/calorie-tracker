import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add response interceptor for token handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Clear invalid token
            localStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common['Authorization'];
            // Redirect to login
            window.location.href = '/auth';
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

// Token can be set later by the auth system
const token = localStorage.getItem('token');
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosInstance;
