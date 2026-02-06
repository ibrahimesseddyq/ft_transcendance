const jobPhaseRepository = require('../repositories/jobPhaseRepository');
const jobRepository = require('../repositories/jobRepository');
const {HttpException} = require('../utils/httpExceptions');

const createJobPhase = async (jobPhaseData) => {
	const job = await jobRepository.findJobById(jobPhaseData.id);
	if (!job)
		throw new HttpException(404, "job with the provided id not found");
	const jobPhase = await jobPhaseRepository.createJobPhase(jobPhaseData);
	return jobPhase;
}

const updateJobPhase = async (jobPhaseId, updateData) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404, 'jobPhase with the provided id does not exists');
	// here should validate the allowed update data if needed
	jobPhaseRepository.updateJobPhase(jobPhaseId,updateData)
	return jobPhase;
}

const getJobPhaseById = async (jobPhaseId) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404,'jobPhase with the provided id not found');
	return jobPhase;
}

const deleteJobPhase =  async (jobPhaseId) => {
	const jobPhase = await jobPhaseRepository.getJobPhaseById(jobPhaseId);
	if (!jobPhase)
		throw new HttpException(404, 'jobPhase with the provided id does not exists')
	await jobPhaseRepository.deleteJobPhase(jobPhaseId);
} 

const getJobPhases = async(jobId) => {
	const job = await jobRepository.findJobById(jobId);
	if (!job)
		throw new HttpException(404,'job with the provided id does not exists');
	const result = await jobPhaseRepository.getJobPhases(jobId);
	return result;
}

module.exports = {
	createJobPhase,
	updateJobPhase,
	getJobPhaseById,
	deleteJobPhase,
	getJobPhases
}