import { API_ROUTES } from '@/config/api-routes';
import { env } from '@/config/env';
import { useAuthStore } from '@/core/stores/auth.store';
import { ApiError } from './api-error';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupResponseInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Unwrap standard API response data if envelope exists
      return response;
    },
    async (error: AxiosError<any>) => {
      const originalRequest = error.config as any;

      if (!error.response) {
        throw new ApiError('Network error. Please check your internet connection.', 0);
      }

      const status = error.response.status;

      // Handle 401 Unauthorized Session & Token Refresh Flow
      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const { refreshToken, logout, setAuth, user } = useAuthStore.getState();

        if (refreshToken) {
          try {
            const refreshUrl = `${env.apiUrl}${API_ROUTES.auth.refresh}`;
            const response = await axios.post(refreshUrl, { refreshToken });

            const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

            if (newAccessToken && user) {
              setAuth(newAccessToken, refreshToken, user);
              processQueue(null, newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return client(originalRequest);
            }
          } catch (refreshErr) {
            processQueue(refreshErr as AxiosError, null);
            logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw new ApiError('Session expired. Please log in again.', 401);
          } finally {
            isRefreshing = false;
          }
        } else {
          logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }

      // Standardize Error Payload
      const errorData = error.response.data;
      if (errorData && typeof errorData === 'object') {
        throw ApiError.fromPayload(errorData, status);
      }

      throw new ApiError(error.message || 'An error occurred during request', status);
    }
  );
}
