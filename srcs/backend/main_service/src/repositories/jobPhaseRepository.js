const {prisma} = require('../config/prisma');

const createJobPhase = async(phaseData) => {
	return await prisma.jobPhase.create({
		data : phaseData
	})
}

const updateJobPhase = async (jobPhaseId, updateData) => {
	return await prisma.jobPhase.update({
		where : {id : jobPhaseId},
		data: updateData
	})
}

const getJobPhaseById = async (jobPhaseId) => {
	return prisma.jobPhase.findUnique({
		where : {id: jobPhaseId}
	})
}

const deleteJobPhase = async (jobPhaseId) => {
	return await prisma.jobPhase.delete({
		where : {
			id : jobPhaseId
		}
	})
}

const getJobPhases = async (JobId) => {
	return await prisma.jobPhase.findMany({
		where : {
			jobId: JobId
		}
	})
}

module.exports = {
	createJobPhase,
	updateJobPhase,
	getJobPhaseById,
	deleteJobPhase,
	getJobPhases
}