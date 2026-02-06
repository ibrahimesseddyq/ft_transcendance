const applicationRepository = require('../repositories/applicationRepository');
const applicationPhaseservice = require('./applicationPhaseService');
const {HttpException} = require('../utils/httpExceptions');
const jobPhaseService =  require('./jobPhaseService');


const submitApplication = async (applicationData) => {
	try {
		return await applicationRepository.createApplication(applicationData);
	} catch (error) {
		if (error.code === "P2002")
			throw new HttpException(400, 'application already exists');
		else if (error.code === "P2003")
			throw new HttpException(404, "job or user not found");
	}
}


const createApplicationPhases = async (applicationId, jobId) => {
	const jobPhases =  await jobPhaseService.getJobPhases(jobId);
	for (let jobPhase of  jobPhases)
	{
		await applicationPhaseservice.createApplicationphase({
			phaseId : jobPhase.id,
			applicationId
		})
	}
}

const getApplicaticationById = async (applicationId) => {

	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application;
}
const advance = async (applicationId) => {
	const application =  await applicationRepository.getApplicaticationById(applicationId);
	if (application)
		throw new HttpException(404, "application not fount");
	const currentPhase = application.find( phase => phase.id === application.currentPhaseId)
	// if (currentPhase.status !== 'in_progress')
	// 	throw 
}


module.exports = {
	getApplicaticationById
}