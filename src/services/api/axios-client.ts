import { env } from '@/config/env';
import axios from 'axios';
import { authRequestInterceptor } from './request-interceptor';
import { setupResponseInterceptor } from './response-interceptor';

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));
setupResponseInterceptor(axiosClient);

export const publicAxiosClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupResponseInterceptor(publicAxiosClient);

export default axiosClient;
