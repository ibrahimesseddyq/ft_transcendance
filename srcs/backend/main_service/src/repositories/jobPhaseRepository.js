const {prisma} = require('../config/prisma');

const createJobPhase = async(phaseData) => {
	return await prisma.jobphase.create({
		data : phaseData
	})
}

const updateJobPhase = async (jobPhaseId, updateData) => {
	return await prisma.jobphase.update({
		where : {id : jobPhaseId},
		data: updateData
	})
}

const getJobPhaseById = async (jobPhaseId) => {
	return prisma.jobphase.findUnique({
		where : {id: jobPhaseId}
	})
}

const deleteJobPhase = async (jobPhaseId) => {
	return await prisma.jobphase.delete({
		where : {
			id : jobPhaseId
		}
	})
}

const getJobPhases = async (JobId) => {
	return await prisma.jobphase.findMany({
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