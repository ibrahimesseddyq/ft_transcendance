import * as applicationRepository from '../repositories/applicationRepository.js';
import * as applicationPhaseservice from './applicationPhaseService.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as jobService from './jobService.js';
import * as jobPhaseService from './jobPhaseService.js';
import {prisma} from '../config/prisma.js'; 


export const submitApplication = async (data) => {
	const job = await jobService.getJobById(data.jobId);
	if (!job || !job.jobPhases || job.jobPhases.length === 0 || job.status != 'open')
		throw new HttpException(400, 'cannot apply to this job');
	return await prisma.$transaction( async (tx) => {
		const application = await tx.application.create({data,
			include: {
				applicationPhases: true
			}
		});
		const applicationPhases = await Promise.all(
			job.jobPhases.map(phase => 
				tx.applicationPhase.create({
					data : {
					applicationId: application.id,
					phaseId: phase.id
				}
				})
			)
		)
		await tx.application.update({
			where : {id : application.id},
			data : {currentPhaseId : applicationPhases[0].id}
		})
		return application;
	})
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
	if (application.status != 'inProgress' || application.job.status != 'open')
		throw new HttpException(400, 'cannot make progress in this application');
	const phases = application.applicationPhases;
	const currentPhase = phases.find(phase => phase.id === application.currentPhaseId)
	if (currentPhase.status !== 'completed')
		throw new HttpException(400,"can't advance to next phase");
	const currentIndex = phases.indexOf(currentPhase);
	if(currentIndex + 1 == phases.length)
		throw new HttpException(400, 'application already completed');
	const nextPhase = phases[currentIndex + 1];
	const [newPhase, newApplication] = await Promise.all([
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
	return await applicationPhaseservice.getApplicaticationPhaseById(application.currentPhaseId);
}