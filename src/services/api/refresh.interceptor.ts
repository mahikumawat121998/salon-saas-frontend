import { API_ENDPOINTS } from '@/config';
import { AUTH_STORAGE_KEYS } from '@/core/constants/auth.constants';
import { useAuthStore } from '@/core/stores/auth.store';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupRefreshInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes(API_ENDPOINTS.auth.login) &&
        !originalRequest.url?.includes(API_ENDPOINTS.auth.refreshToken)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(axiosInstance(originalRequest));
              },
              reject: (err: unknown) => {
                reject(err);
              },
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt refresh with HTTP-Only Cookie (or fallback to stored token)
          const fallbackToken = useAuthStore.getState().refreshToken || (
            typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken) : null
          );

          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}${API_ENDPOINTS.auth.refreshToken}`,
            { refreshToken: fallbackToken || undefined },
            { withCredentials: true }
          );

          const { token: newToken, refreshToken: newRefreshToken, user } = response.data;
          const currentUser = user || useAuthStore.getState().user;

          if (currentUser) {
            useAuthStore.getState().setAuth(newToken, newRefreshToken || fallbackToken || '', currentUser);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
