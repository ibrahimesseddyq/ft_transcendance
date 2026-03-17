import * as applicationRepository from '../repositories/applicationRepository.js';
import * as applicationPhaseservice from './applicationPhaseService.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as jobService from './jobService.js';
import {prisma} from '../config/prisma.js';
import { createNotification } from './notificationService.js';


export const submitApplication = async (data, io) => {
	const job = await jobService.getJobById(data.jobId);
	if (!job || !job.jobPhases || job.jobPhases.length === 0 || job.status != 'open')
		throw new HttpException(400, 'cannot apply to this job');
	const application = await prisma.$transaction( async (tx) => {
		const application = await tx.application.create({data,
			include: {
				candidate: { select: { firstName: true, lastName: true } }
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

	if (job.userId && io) {
		const candidateName = `${application.candidate.firstName} ${application.candidate.lastName}`.trim();
		await createNotification(io, {
			userId: job.userId,
			type: 'applicationReceived',
			title: 'New application received',
			message: `${candidateName} applied for "${job.title}".`,
			referenceType: 'application',
			referenceId: application.id
		});
	}

	return application;
}

export const getApplicaticationById = async (applicationId) => {
	const application = await applicationRepository.getApplicaticationById(applicationId);
	if (!application)
		throw new HttpException(404, "application not found");
	return application;
}
export const advance = async (applicationId) => {
    return await prisma.$transaction(async (tx) => {
        const application = await tx.application.findUnique({
            where: { id: applicationId },
            include: { 
                applicationPhases: {
                    orderBy: { id: 'asc' } 
                } 
            }
        });

        if (!application) throw new HttpException(404, 'application not found');
        if (application.status !== 'inProgress')
            throw new HttpException(400, 'cannot make progress in this application');

        const phases = application.applicationPhases;
        const currentPhase = phases.find(p => p.id === application.currentPhaseId);
        
        if (!currentPhase) 
            throw new HttpException(400, 'Current phase not found in application phases');
        if (currentPhase.status !== 'completed')
            throw new HttpException(400, "can't advance to next phase");

        const currentIndex = phases.indexOf(currentPhase);
        if (currentIndex + 1 === phases.length)
            throw new HttpException(400, 'application already completed');

        const nextPhase = phases[currentIndex + 1];

        const updated = await tx.application.updateMany({
            where: { 
                id: applicationId, 
                currentPhaseId: currentPhase.id 
            },
            data: { 
                currentPhaseId: nextPhase.id,
                status: 'inProgress'
            }
        });

        if (updated.count === 0) throw new HttpException(409, 'Concurrent modification — retry');
        
		return await tx.applicationPhase.update({
            where: { id: nextPhase.id },
            data: { status: 'inProgress' }
        });
    });
};

export const rejectApplication = async (applicationId, io) => {
	const app = await prisma.application.findUnique({
		where: { id: applicationId },
		include: { job: { select: { title: true } } }
	});
	if (!app) throw new HttpException(404, 'application not found');
	if (['accepted', 'rejected', 'withdrawn'].includes(app.status))
        throw new HttpException(400, `Cannot reject application with status: ${app.status}`);
	const updated = await applicationRepository.updateApplication(applicationId, { status: 'rejected' });
	if (app && io) {
		await createNotification(io, {
			userId: app.candidateId,
			type: 'rejected',
			title: 'Application rejected',
			message: `Your application for "${app.job.title}" has been rejected.`,
			referenceType: 'application',
			referenceId: applicationId
		});
	}
	return updated;
}

export const acceptApplication = async (applicationId, io) => {
	const app = await prisma.application.findUnique({
		where: { id: applicationId },
		include: { job: { select: { title: true } } }
	});
	if (!app) throw new HttpException(404, 'application not found');
	const updated = await applicationRepository.updateApplication(applicationId, { status: 'accepted' });
	if (io) {
		await createNotification(io, {
			userId: app.candidateId,
			type: 'accepted',
			title: 'Application accepted',
			message: `Congratulations! Your application for "${app.job.title}" has been accepted.`,
			referenceType: 'application',
			referenceId: applicationId
		});
	}
	return updated;
}

export const withdrawApplication = async (applicationId, userId) => {
    const application = await applicationRepository.getApplicaticationById(applicationId);
    if (!application)
        throw new HttpException(404, 'application not found');
    if (application.candidateId !== userId)
        throw new HttpException(403, 'Forbidden');
    if (['rejected', 'accepted', 'withdrawn'].includes(application.status))
        throw new HttpException(400, `Cannot withdraw an application with status: ${application.status}`);
    return await applicationRepository.updateApplication(applicationId, { status: 'withdrawn' });
};

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
	if (!application.currentPhaseId)
    	throw new HttpException(404, 'No active phase for this application');
	return await applicationPhaseservice.getApplicaticationPhaseById(application.currentPhaseId);
}