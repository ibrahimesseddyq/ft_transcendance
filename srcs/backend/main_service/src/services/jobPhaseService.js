import * as jobPhaseRepository from '../repositories/jobPhaseRepository.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as quizClientService from './quizClientService.js'

export const createJobPhase = async (jobPhaseData) => {
    const response = await quizClientService.getTestById(jobPhaseData.testId);
    if (!response.success) throw new HttpException(400, 'test not found');
    const jobPhase = await jobPhaseRepository.createJobPhase(jobPhaseData);
    const verify = await quizClientService.getTestById(jobPhaseData.testId).catch(() => null);
    if (!verify?.success) {
        await jobPhaseRepository.deleteJobPhase(jobPhase.id).catch(() => {});
        throw new HttpException(409, 'Test became unavailable during phase creation — please retry');
    }

    return jobPhase;
};

export const updateJobPhase = async (jobPhaseId, updateData) => {
	return await jobPhaseRepository.updateJobPhase(jobPhaseId,updateData)
}

export const getJobPhaseById = async (jobPhaseId) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404,'jobPhase with the provided id not found');
	return jobPhase;
}

export const deleteJobPhase =  async (jobPhaseId) => {
	await jobPhaseRepository.deleteJobPhase(jobPhaseId);
} 

export const getJobPhases = async(jobId) => {
	return await jobPhaseRepository.getJobPhases(jobId);
}