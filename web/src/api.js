import axios from 'axios';
import { API_BASE } from './config';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000
});

// Interceptor simple para agregar un header de cliente
api.interceptors.request.use((config) => {
  config.headers['X-Y2Back-Client'] = 'web-ui';
  return config;
});
