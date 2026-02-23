import * as applicationRepository from '../repositories/applicationRepository.js';
import * as applicationPhaseservice from './applicationPhaseService.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as jobPhaseService from './jobPhaseService.js';


export const submitApplication = async (applicationData) => {
	const applicationPhases = [];
	const[ application, jobPhases] = await Promise.all([
		applicationRepository.createApplication(applicationData),
		jobPhaseService.getJobPhases(applicationData.jobId)
	]);
	jobPhases.array.forEach(phase => {
		applicationPhases.push(
			applicationPhaseservice.createApplicationphase({
				applicationId: application.id,
				phaseId: phase.id,
			})
		)
	});
	await Promise.all(applicationPhases);
	return application;
}

export const getApplicaticationById = async (applicationId) => {
	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application;
}

export const advance = async (applicationId) => {
	const application =  await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not fount");
	const phases = application.applicationPhases;
	const currentPhase = phases.find(phase => phase.id === application.currentPhaseId)
	if (currentPhase.status !== 'completed')
		throw new HttpException(400,"can't advance to next phase");
	if(phases.indexOf(currentPhase) + 1 >= phases.length)
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

export const rejectApplication =  async (applicationId) => {
	const application = await applicationRepository.updateApplication(applicationId,{
		status:'rejected'
	})
	return application;
}

export const withdrawApplication = async (applicationId) => {
	const application = await applicationRepository.updateApplication(applicationId,{
		status: 'withdrawn'
	})
	return application;
}

export const getApplicaticationPhases = async (applicationId) => {
	const application =  await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application.applicationPhases;
}

export const getCurrentPhase = async (applicationId) => {
	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application.applicationPhases.find( phase => phase.id ===  application.currentPhaseId);
}
