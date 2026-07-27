import { API_CONFIG } from '@/config';
import axios from 'axios';
import { authRequestInterceptor } from './auth.interceptor';
import { setupRefreshInterceptor } from './refresh.interceptor';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: API_CONFIG.headers,
});

apiClient.interceptors.request.use(authRequestInterceptor, (error) =>
  Promise.reject(error)
);

setupRefreshInterceptor(apiClient);

export const publicApiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: API_CONFIG.headers,
});

export default apiClient;
