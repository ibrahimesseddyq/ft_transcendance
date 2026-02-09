const applicationRepository = require('../repositories/applicationRepository');
const applicationPhaseservice = require('./applicationPhaseService');
const {HttpException} = require('../utils/httpExceptions');
const jobPhaseService =  require('./jobPhaseService');


const submitApplication = async (applicationData) => {
	try {
		 let application = await applicationRepository.createApplication({
			jobId : applicationData.jobId,
			candidateId: applicationData.candidateId,
			currentPhaseId: null,
		});
		application =  await applicationRepository.updateApplication(application.id,
			{
				applicationPhases: createApplicationPhases(application.id,applicationData.jobId)
			}
		)
		return application;
	} catch (error) {
		if (error.code === "P2002")
			throw new HttpException(400, 'application already exists');
		else if (error.code === "P2003")
			throw new HttpException(404, "job or user not found");
	}
}

const createApplicationPhases = async (applicationId, jobId) => {
	const jobPhases =  await jobPhaseService.getJobPhases(jobId);
	const applicationPhases = [];
	if (!jobPhases)
		throw new HttpException(400, "no phases for this job")
	for (let jobPhase of  jobPhases)
	{
		applicationPhases.push(await applicationPhaseservice.createApplicationphase({
			phaseId : jobPhase.id,
			applicationId,
			startedAt:null,
			notes: null,
			score: 0,
		}))
	}
	return applicationPhases;
}

const getApplicaticationById = async (applicationId) => {

	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application;
}

const advance = async (applicationId) => {
	const application =  await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not fount");
	const phases = application.applicationPhases;
	const currentPhase = phases.find(phase => phase.id === application.currentPhaseId)
	if (currentPhase.status !== 'completed')
		throw new HttpException(400,"can't advance to next phase");
	if(phases.indexOf(currentPhase) + 1 > phases.length)
		throw new HttpException(400, 'application already completed');
	const nextPhase = phases[phases.indexOf(currentPhase) + 1];
	const {newPhase, newApplication} = await Promise.all([
		applicationPhaseservice.updateApplicationPhase(nextPhase.id, {
			status:"in_progress"
		}),
		applicationRepository.updateApplication(applicationId,{
			currentPhaseId: nextPhase.id
		})
	])
	return newPhase;
}

const rejectApplication =  async (applicationId) => {
	const application = await applicationRepository.updateApplication(applicationId,{
		status:'rejected'
	})
	return application;
}

const withdrawApplication = async (applicationId) => {
	const application = await applicationRepository.updateApplication(applicationId,{
		status: 'withdrawn'
	})
	return application;
}

const getApplicaticationPhases = async (applicationId) => {
	const application =  await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application.applicationPhases;
}

const getCurrentPhase = async (applicationId) => {
	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application.applicationPhases.find( phase => phase.id ===  application.currentPhaseId);
}
module.exports = {
	submitApplication,
	getApplicaticationById,
	advance,
	rejectApplication,
	withdrawApplication,
	getApplicaticationPhases,
	getCurrentPhase
}