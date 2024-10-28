// src/services/api.js
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';


const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken(); 

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Token enviado:', token); 
        } else {
            console.warn('Token não encontrado. Verifique a autenticação.'); 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
