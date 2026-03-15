import axios from "axios";
import env from '../config/env.js'

const aiClient = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: 5000,
    headers : {
        "Content-Type": "application/json",
        "x-api-ai-key":env.AI_INTERNAL_API_KEY
    }
})

aiClient.interceptors.response.use(

)

export default aiClient;