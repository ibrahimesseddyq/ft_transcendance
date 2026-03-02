import quizClient from "../utils/quizClient.js";

export const getTestById = async (testId) => {
    const response = await quizClient.get(/* need to set uRI*/);
    return response;
}

export const evaluateTest = async (testId, answers) => {
   const respose = await quizClient.post(
    '',
    {answers : answers}
   )
   return  respose.data;
}