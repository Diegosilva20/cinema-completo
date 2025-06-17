import axios from 'axios';

// A URL base do seu backend NestJS, lida do .env configurado para Vite
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;