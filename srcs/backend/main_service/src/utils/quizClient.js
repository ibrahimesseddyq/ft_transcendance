import axios from 'axios';
import env from '../config/env.js';
import { HttpException } from './httpExceptions.js';

const quizClient = axios.create({
    baseURL: env.QUIZ_SERVICE_URL,
    timeout: 5000,
    headers: {
        "Content-Type" : "application/json",
        'x-internal-api-key': env.INTERNAL_API_KEY
    }
})

quizClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        console.log('quizClient.baseURL ',quizClient.baseURL)
        if (error.response)
            throw new HttpException(error.response.status, 
            error.response.data?.message || "quiz service error");
        else if (error.code === 'ECONNREFUSED')
            throw new HttpException(503, 'Quiz service is unavailable');
        else
            throw new HttpException(502,'Failed to communicate with quiz service')
    }
)

export default quizClient;