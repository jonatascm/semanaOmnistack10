import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.40:1008',
});

export default api;
