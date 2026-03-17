import {prisma} from '../config/prisma.js';

export const createApplication =  async (data) => {
	return await prisma.application.create({
		data: data
	})
}

export const deleteApplication =  async (applicationId) => {
	return await prisma.application.delete({
		where:{
			id: applicationId
		},
		include: {
        applicationPhases: {
            orderBy: { jobPhase: { orderIndex: 'asc' } }
        },
        job: { select: { status: true, title: true } }
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
		where:{ id : appliocationId},
		include: {
		applicationPhases: { orderBy: { jobPhase: { orderIndex: 'asc' } } },
		job: { select: { title: true, status: true } },
		candidate: { select: { firstName: true, lastName: true, email: true } }
	}

	})
}

export const getApplicatications = async (skip = 0, take = 100, filters = {}) => {
    return await prisma.application.findMany({
        where: filters,
        skip,
        take,
        orderBy: { appliedAt: 'desc' }
    });
};

export const getApplicationByJobAndCondidate = async(jobId, candidateId) => {
	return await prisma.application.findFirst({
    	where: { jobId, candidateId }
});
}
