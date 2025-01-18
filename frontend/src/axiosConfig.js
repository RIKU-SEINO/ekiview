import axios from 'axios';

console.log('VITE_API_BASE_URL:', __VITE_API_BASE_URL__);

const axiosInstance = axios.create({
  baseURL: __VITE_API_BASE_URL__,
  withCredentials: true,
});
export default axiosInstance;
