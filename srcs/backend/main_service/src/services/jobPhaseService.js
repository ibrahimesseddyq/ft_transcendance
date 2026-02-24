import * as jobPhaseRepository from '../repositories/jobPhaseRepository.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as quizClientService from './quizClientService.js'

export const createJobPhase = async (jobPhaseData) => {
	return await jobPhaseRepository.createJobPhase(jobPhaseData);
}

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