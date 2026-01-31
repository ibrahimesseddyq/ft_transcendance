const prisma =  require('../../generated/prisma');

const createApplication =  async (data) => {
	return await prisma.application.create({
		where : {
			data: data
		}
	})
}

const deleteApplication =  async (applicationId) => {
	return await prisma.application.delete({
		where:{
			id: applicationId
		}
	})
}

const updateApplication = async (applicationId,updateData) => {
	return await prisma.application.update({
		where : {id : applicationId},
		data:updateData
	})
}

const getApplicaticationById = async (appliocationId) => {
	return await prisma.application.findUnique({
		where:{ id : appliocationId}
	})
}

const getApplicatications = async (skip = 0, take = 10, filters= []) => {
	return await prisma.findMany({

	})
}

const getApplicationByJobAndCondidate = async(jobId, candidateId) => {
	return await prisma.application.findUnique({
		where :{
			jobId: jobId,
			candidateId:candidateId
		}
	})
}

module.exports = {
	createApplication,
	getApplicatications,
	getApplicaticationById,
	updateApplication,
	deleteApplication,
	getApplicationByJobAndCondidate
}