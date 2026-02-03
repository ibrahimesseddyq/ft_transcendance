const applicationRepository = require('../repositories/applicationRepository');
const jobService = require('./jobService');
const userService = require('./userService');
const {HttpException} = require('../utils/httpExceptions');

const submitApplication = async (applicationData) => {
	const job  = await jobService.getJobById(applicationData.jobId);
	if (!job)
		throw new HttpException(404, 'job with the specified id not found');
	const user =  await userService.getUserById(applicationData.candidateId);
	if (!user)
		throw new HttpException(404,'user with the specified id not found');
	if (await applicationRepository.getApplicationByJobAndCondidate(
		applicationData.jobId,
		applicationData.candidateId
	))
		throw new HttpException(400, 'user already apply to this job');
	const application = applicationRepository.createApplication(applicationData);
	return application;
}

const getJobApplications =  async (jobId) => {
	const job = await jobService.getJobById(jobId);
	if (!job)
		throw new HttpException(404, "job not found");
	return job.applications;
}

const createApplicationPhases = async (applicationId, jobId) => {
	
}

const getApplicaticationById = async (applicationId) => {
	return await applicationRepository.getApplicaticationById(applicationId);
}

module.exports = {
	getApplicaticationById
}