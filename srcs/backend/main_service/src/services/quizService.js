import * as quizSevice from './quizClientService.js'
import * as applicationPhaseService from './applicationPhaseService.js';
import * as applicationService from './applicationService.js';
import { HttpException } from "../utils/httpExceptions.js";

export const startTest = async (data) => {
    const {testId, userId, applicationPhaseId} = data;
    const applicationPhase = await applicationPhaseService.getApplicaticationPhaseById(applicationPhaseId);
    if (!applicationPhase)
        throw new HttpException(404, 'application phase does not exists');
    const application =  await applicationService.getApplicaticationById(applicationPhase.applicationId);
    if (application.status !== 'inProgress' && application.status !== 'pending' )
        throw new HttpException(400, 'application is not in progress');
    if (application.candidateId != userId)
        throw new HttpException(403, 'you are not a cadidate for this application');
    if (applicationPhase.status !== 'pending' && applicationPhase.status !== 'inProgress')
        throw new HttpException(404, 'this test phase not available');
    if (applicationPhase.jobPhase.testId != testId)
        throw new HttpException(400,'This test is not assigned to this phase');
    const test = await quizSevice.getTestById(testId);
    if (applicationPhase.status === 'pending')
        await applicationPhaseService.updateApplicationPhase(applicationPhase.id,{
                status: 'inProgress',
                startedAt: new Date()
            })
    const startedAt = applicationPhase.startedAt || new Date();
    const durationMs = (test.durationMinutes ?? 0) * 60 * 1000;
    return {
        test: test,
        startedAt: startedAt,
        completedAt: new Date(startedAt.getTime() + durationMs)
    }
}

export const submitTest = async (data) => {
    const testId = data.params.testId;
    const { applicationPhaseId, answers, userId } = data.body;
    
    const applicationPhase = await applicationPhaseService.getApplicaticationPhaseById(applicationPhaseId);

    if (applicationPhase.application?.candidateId !== userId)
        throw new HttpException(403, 'not your application');
        
    if (applicationPhase.status !== 'inProgress')
        throw new HttpException(400, 'Test not started or already completed');
    const evaluationResult = await quizSevice.evaluateTest(testId, answers);
    console.log(evaluationResult)
    await applicationPhaseService.updateApplicationPhase(applicationPhaseId, {
        status: evaluationResult.passed ? 'completed' : 'failed',
        score: evaluationResult.totalScore,
        completedAt: new Date(),
    });

    return {
        score: evaluationResult.totalScore,
        maxPossibleScore: evaluationResult.maxPossibleScore,
        percentage: evaluationResult.percentage,
        passed: evaluationResult.passed,
        details: evaluationResult.result
    };
};