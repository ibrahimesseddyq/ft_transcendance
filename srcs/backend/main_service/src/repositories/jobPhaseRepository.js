import prisma from '../../generated/prisma/index.js';

export const createJobPhase = async(phaseData) => {
	return await prisma.jobPhase.create({
		data : phaseData,
	})
}

export const updateJobPhase = async (jobPhaseId, updateData) => {
	return await prisma.jobPhase.update({
		where : {id : jobPhaseId},
		data: updateData
	})
}

export const getJobPhaseById = async (jobPhaseId) => {
	return prisma.jobPhase.findUnique({
		where : {id: jobPhaseId}
	})
}

export const deleteJobPhase = async (jobPhaseId) => {
	return await prisma.jobPhase.delete({
		where : {
			id : jobPhaseId
		}
	})
}

export const getJobPhases = async (JobId) => {
	return await prisma.jobPhase.findMany({
		where : {
			jobId: JobId
		}
	})
}
