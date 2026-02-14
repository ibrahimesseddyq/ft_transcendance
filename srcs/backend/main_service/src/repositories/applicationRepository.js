import {prisma} from '../config/prisma';

export const createApplication =  async (data) => {
	return await prisma.application.create({
		data: data
	})
}

export const deleteApplication =  async (applicationId) => {
	return await prisma.application.delete({
		where:{
			id: applicationId
		}
	})
}

export const updateApplication = async (applicationId,updateData) => {
	return await prisma.application.update({
		where : {id : applicationId},
		data:updateData
	})
}

export const getApplicaticationById = async (appliocationId) => {
	return await prisma.application.findUnique({
		where:{ id : appliocationId}
	})
}

export const getApplicatications = async (skip = 0, take = 10, filters= []) => {
	return await prisma.application.findMany({

	})
}

export const getApplicationByJobAndCondidate = async(jobId, candidateId) => {
	return await prisma.application.findUnique({
		where :{
			jobId: jobId,
			candidateId:candidateId
		}
	})
}
