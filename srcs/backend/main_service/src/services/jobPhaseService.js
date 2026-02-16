import * as jobPhaseRepository from '../repositories/jobPhaseRepository.js';
import * as jobRepository from '../repositories/jobRepository.js';
import {HttpException} from '../utils/httpExceptions.js';

export const createJobPhase = async (jobPhaseData) => {
	const job = await jobRepository.findJobById(jobPhaseData.id);
	if (!job)
		throw new HttpException(404, "job with the provided id not found");
	const jobPhase = await jobPhaseRepository.createJobPhase(jobPhaseData);
	return jobPhase;
}

export const updateJobPhase = async (jobPhaseId, updateData) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404, 'jobPhase with the provided id does not exists');
	// here should validate the allowed update data if needed
	jobPhaseRepository.updateJobPhase(jobPhaseId,updateData)
	return jobPhase;
}

export const getJobPhaseById = async (jobPhaseId) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404,'jobPhase with the provided id not found');
	return jobPhase;
}

export const deleteJobPhase =  async (jobPhaseId) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404, 'jobPhase with the provided id does not exists')
	await jobPhaseRepository.deleteJobPhase(jobPhaseId);
} 

export const getJobPhases = async(jobId) => {
	try {
		const result =  await jobPhaseRepository.getJobPhases(jobId);
		return result.jobPhases;
	} catch (error) {
		if (error.code === "P2002")
			throw new HttpException(400, "job  not found");
		else
			throw error
	}
}