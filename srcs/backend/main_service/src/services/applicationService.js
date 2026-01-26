const applicationRepository = require('../repositories/applicationRepository');
const jobService = require('./jobService');
const userService = require('./userService');
const {HttpException} = require('../utils/httpExceptions');

const submitApplication = async (applicationData) => 
{
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
}