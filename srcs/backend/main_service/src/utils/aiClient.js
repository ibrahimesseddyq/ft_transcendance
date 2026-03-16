import axios from "axios";
import env from '../config/env.js';
import { HttpException } from "./httpExceptions.js";

const aiClient = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: 10000,
    headers : {
        "Content-Type": "application/json",
        "x-api-ai-key":env.AI_INTERNAL_API_KEY
    }
})

aiClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const isTimeout = err.code === 'ECONNABORTED';
        const status = err.response?.status || (isTimeout ? 504 : 500);
        const data = err.response?.data;
        const message = data?.message || err.message || 'AI Service Error';
        const error = new HttpException(status, message);
        error.name = 'AIClientError';
        error.aiError = true;
        error.isTimeout = isTimeout;
        error.data = data;
        error.cause = err;
        return Promise.reject(error);
    }
)

export default aiClient;