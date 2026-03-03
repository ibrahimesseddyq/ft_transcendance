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
    if (application.candidateId != userId)
        throw new HttpException(403, 'you are not a cadidate for this application');
    if (applicationPhase.status != 'pending' && applicationPhase.status != 'in_progress')
        throw new HttpException(404, 'this test phase not available');
    if (applicationPhase.jobPhase.testId != testId)
        throw new HttpException(400,'This test is not assigned to this phase');
    const test = await quizSevice.getTestById(testId);
    if (applicationPhase.status === 'pending')
        await applicationPhaseService.updateApplicationPhase(applicationPhase.id,{
                status: 'in_progress',
                startedAt: Date.now()
            })
    return {
        test: test,
        startedAt: applicationPhase.startedAt || Date.now(),
        completedAt: (applicationPhase.completedAt || Date.now()) + test.durationMinutes,

    }
}

export const submitTest = async (data) => {
    const testId = data.params.testId;
    const userId = data.user.userId;
    const {applicationPhaseId, answers} = data.body;
    const applicationPhase = await applicationPhaseService.getApplicaticationPhaseById(applicationPhaseId);
    if (applicationPhase.application.candidateId != userId)
        throw new HttpException(403, 'not your application');
    if (applicationPhase.status != 'in_progress')
        throw new HttpException(400,'Test not started or already completed');
    const deadLine = applicationPhase.startedAt + applicationPhase.jobPhase * 60 * 1000;
    if (Date.now() > deadLine)
    {
        await applicationPhaseService.updateApplicationPhase(applicationPhaseId, {
            completedAt : Date.now(),
            status:'failed',
            score: 0,
            notes : 'Time expired — auto-failed'
        })
        throw new HttpException(400, 'Test duration has expired ');
    }
    const evaluationResult = await quizSevice.evaluateTest(testId, answers);
    await applicationPhaseService.updateApplicationPhase(applicationPhaseId, {
        status: evaluationResult.passed ? 'completed' : 'failed',
        score: evaluationResult.totalScore,
        completedAt: Date.now(),
    })
    return {
        score: evaluationResult.totalScore,
        maxPossibleScore: evaluationResult.maxPossibleScore,
        percentage: evaluationResult.percentage,
        passed : evaluationResult.passed,
        details: evaluationResult.result
    }
    
}