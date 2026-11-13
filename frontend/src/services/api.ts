import axios from 'axios';
import { ApiResponse, HealthResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach Authorization header if JWT token is stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('slotwise_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const healthApi = {
  getHealth: async (): Promise<ApiResponse<HealthResponse>> => {
    const response = await api.get<ApiResponse<HealthResponse>>('/health');
    return response.data;
  },
};

export default api;

