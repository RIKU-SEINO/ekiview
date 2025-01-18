import axios from 'axios';

console.log('VITE_API_BASE_URL_STRING:', JSON.stringify(process.env.VITE_API_BASE_URL));

const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  withCredentials: true,
});
export default axiosInstance;
