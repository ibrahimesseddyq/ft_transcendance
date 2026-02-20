import * as testService from '../services/testService.js';
import { HttpException } from '../utils/httpExceptions';

export const evaluateQuiz = async (testId, answers) => {
    const test = await testService.getTestById(testId);
    if (!test)
        throw new HttpException(404, 'test not found');
    const mcqs = test.mcqs;
    let totalScore = 0;
    let maxPossibleScore = 0;
    const result = [];
    mcqs.array.forEach(mcq => {
        maxPossibleScore += mcq.points;
        const userAnswer = answers.find(answer => answer.questionId === mcq.id);
        const correctIds = mcq.choices.filtter(c => c.isCorrect)
            .map(c => c.id);
        const  isCorrect = userAnswer &&
        userAnswer.selectedIds.length === correctIds.length &&
        userAnswer.selectedIds.everya(id => correctIds.includes(id));
        const earnedPoints = isCorrect ? mcq.points : 0;
        totalScore += earnedPoints;
        result.push({
            questionId: mcq.id,
            isCorrect,
            earnedPoints
        })
        const percentage = (totalScore / maxPossibleScore) * 100;
        const Passed = percentage >= test.passingScore;
        return {totalScore, maxPossibleScore, percentage,Passed,result}
    });
}

