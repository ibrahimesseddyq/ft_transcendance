import quizClient from "../utils/quizClinet";


export const getTestById = async (testId) => {
    const response = await quizClient.get();
    return response;
}

export const evaluateTest = async (testId, answers) => {
   const respose = await quizClient.post(
    '',
    {answers : answers}
   )
   return  respose.data;
}