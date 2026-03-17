import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/utils/ZuStand';

interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}

interface CustomConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

console.log("herererer : ", import.meta.env.VITE_RAG_SERVICE_URL);

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];
const env_main_api = import.meta.env.VITE_MAIN_API_URL;

const attachInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use((config) => {
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as CustomConfig;
            console.log("originalRequest :", originalRequest);

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
                        `${import.meta.env.VITE_MAIN_SERVICE_URL}${env_main_api}/auth/refresh`,
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

export const mainApi = axios.create({
    baseURL: import.meta.env.VITE_MAIN_SERVICE_URL,
    withCredentials: true,
});

export const chatApi = axios.create({
    baseURL: import.meta.env.VITE_CHAT_SERVICE_URL, 
    withCredentials: true,
});

export const quizApi = axios.create({
    baseURL: import.meta.env.VITE_QUIZ_SERVICE_URL, 
    withCredentials: true,
});

export const aiapi = axios.create({
    baseURL: import.meta.env.VITE_AI_SERVICE_URL, 
    withCredentials: true,
});

export const ragapi = axios.create({
    baseURL: import.meta.env.VITE_RAG_SERVICE_URL, 
    withCredentials: true,
});



attachInterceptors(mainApi);
attachInterceptors(chatApi);
attachInterceptors(quizApi);
attachInterceptors(ragapi);
attachInterceptors(aiapi);