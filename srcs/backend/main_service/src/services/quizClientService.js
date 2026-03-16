import quizClient from "../utils/quizClient.js";

export const getTestById = async (testId) => {
    const response = await quizClient.get(`/api/quiz/internal/tests/${testId}`);
    return response.data;
}

export const evaluateTest = async (testId, answers) => {
   const respose = await quizClient.post(
    `/api/quiz/internal/tests/${testId}/evaluate`,

    {
        testId : testId,
        answers : answers
    }
   )
   return  respose.data;
}