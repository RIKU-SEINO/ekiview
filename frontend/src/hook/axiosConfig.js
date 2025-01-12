import axios from 'axios';

const host = 'localhost'; 
const apiPort = 5001;
const baseURL = `http://${host}:${apiPort}`;

const axiosInstance = axios.create({
  // baseURLはバックエンドAPIに接続するように修正
  baseURL: baseURL, 
  timeout: 5000
});
export default axiosInstance;
