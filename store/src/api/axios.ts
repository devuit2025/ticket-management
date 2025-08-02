import axios from 'axios';

const api = axios.create({
    baseURL: 'https://your-api-domain.com/api', // Change this to your actual API URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        // You can throw custom error or handle unauthorized, etc.
        return Promise.reject(error);
    }
);

export default api;
