import axios from 'axios';
import { useAuthStore } from '@/utils/ZuStand';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve()
    );
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url?.includes('/api/auth/refresh')) {
            const clearAuth = useAuthStore.getState().clearAuth;
            clearAuth();
            window.location.href = '/Login';
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                const clearAuth = useAuthStore.getState().clearAuth;
                clearAuth();
                window.location.href = '/Login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;