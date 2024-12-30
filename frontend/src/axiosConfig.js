import axios from 'axios';

const host = 'localhost'; 
const apiPort = 5001;
const baseURL = `http://${host}:${apiPort}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});
export default axiosInstance;
