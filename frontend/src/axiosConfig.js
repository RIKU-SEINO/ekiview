import axios from 'axios';

const host = process.env.VITE_HOST
const apiPort = process.env.VITE_API_PORT
const baseURL = `http://${host}:${apiPort}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000
});

export default axiosInstance;
