import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/utils/ZuStand';

interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}

interface CustomConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];
const env_main_api = import.meta.env.VITE_MAIN_API_URL;

const attachInterceptors = (instance: AxiosInstance) => {
     instance.interceptors.request.use((config) => {
        const url = config.url || "";


        if (import.meta.env.DEV) {
            
            if (url.startsWith("/api/main")) {
                config.baseURL = "http://localhost:3000";
            }
            else if (url.startsWith("/api/quiz")) {
                config.baseURL = "http://localhost:3001";
            } else if (url.startsWith("/api/ai")) {
                config.baseURL = "http://localhost:8000";
            } else if (url.startsWith("/api/rag")) {
                config.baseURL = "http://localhost:8001";
            }
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        console.log("FINAL REQUEST =>", {
            url: config.url,
            baseURL: config.baseURL
        });

        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as CustomConfig;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => instance(originalRequest))
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    await axios.post(
                        `${import.meta.env.VITE_SERVICE_URL}${env_main_api}/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );
                    
                    failedQueue.forEach(prom => prom.resolve());
                    failedQueue = [];
                    return instance(originalRequest);
                } catch (refreshError) {
                    failedQueue.forEach(prom => prom.reject(refreshError));
                    useAuthStore.getState().clearAuth(); 
                    
                    failedQueue = [];
                    if (!window.location.pathname.includes('/login')) {
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
};

export const mainService = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    withCredentials: true,
});



attachInterceptors(mainService);
