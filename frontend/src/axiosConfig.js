import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: __VITE_API_BASE_URL__,
  withCredentials: true,
});
export default axiosInstance;
