import * as testService from './testService.js';
import { HttpException } from '../utils/httpExceptions.js';

export const evaluateQuiz = async (test, answers) => {
    const mcqs = test.mcqs;
    console.log('answers ', answers)
    let totalScore = 0;
    let maxPossibleScore = 0;
    const result = [];
    mcqs.forEach(mcq => {
        maxPossibleScore += mcq.points;
        const userAnswer = answers.find(answer => answer.questionId === mcq.id);
        const correctIds = mcq.choices.filter(c => c.isCorrect)
            .map(c => c.id);
        console.log(userAnswer.selectedIds)
        const  isCorrect = userAnswer &&
        userAnswer.selectedIds.length === correctIds.length &&
        userAnswer.selectedIds.every(id => correctIds.includes(id));
        const earnedPoints = isCorrect ? mcq.points : 0;
        totalScore += earnedPoints;
        result.push({
            questionId: mcq.id,
            isCorrect,
            earnedPoints
        })
    });
    const percentage = (totalScore / maxPossibleScore) * 100;
    const passed = percentage >= test.passingScore;
    return {totalScore, maxPossibleScore, percentage,passed,result}
}
export const evaluateCodeChallenge =  async (test, answers) => {
    
}

export const evaluateTest = async (testId, answers) => {
    const test = await testService.getTestById(testId);
    console.log('test ', test);
    let result;
    if (!test)
        throw new HttpException(404, 'test not found');
    if (test.type === 'QUIZ')
        result = evaluateQuiz(test, answers);
    console.log('result ', result);
    // else
    //     result = await evaluateCodeChallenge(test, answers);
    return result;
}

export const getTestForEvalution = async (testId) => {
    const test = await testService.getTestById(testId);
    if (!test)
        throw new HttpException(404, 'test not found');
    return test;
}

