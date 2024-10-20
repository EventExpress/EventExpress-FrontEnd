import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json', 
    'Accept': 'application/json', 
  },
});

export default api;
