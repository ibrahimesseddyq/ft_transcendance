import {prisma} from '../config/prisma.js';
import { getJobPhases } from './jobPhaseRepository.js';


export const findJobById = async (jobId) => {
    return await prisma.job.findUnique({
        where : {id : jobId},
        include : {jobPhases: true}
    })
}

export const createJob = async  (jobData) => {
    return await prisma.job.create({
        data : jobData 
    })
}

export const updateJob = async (jobId, updateData) => {
    return await prisma.job.update({
        where : {id : jobId},
        data: updateData,
    })
}

export const deleteJob = async (jobId) => {
    return await prisma.job.delete({where :{ id : jobId} });
}

export const findManyJobs = async (filters, skip = 0, take = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    const {keyword } = filters;
    const isRemoteBool = filters.isRemote === "true" ? true : 
        filters.isRemote === "false" ? false : undefined;
    const statusArray = filters.status ? filters.status.split(',') : undefined;
    const skillsArray = filters.skills ? filters.skills.split(',') : undefined;
    const deptArray = filters.department ? filters.department.split(',') : undefined;
    const typeArray = filters.employmentType ? filters.employmentType.split(',') : undefined;
    const whereClause = {
        ...(keyword && {
            OR: [
                { title: { contains: keyword } },
                { description: { contains: keyword } },
                { department: { contains: keyword } },
                { employmentType: { contains: keyword } },
                { skills: { contains: keyword } },
            ]
        }),
        ...(skillsArray && {
            OR: skillsArray.map(skill => ({
                skills: { contains: skill.trim() }
            }))
        }),
        department: deptArray ? { in: deptArray } : undefined,
        employmentType: typeArray ? { in: typeArray } : undefined,
        status: statusArray ? { in: statusArray } : undefined,
        isRemote: isRemoteBool,
    };

    const [jobs, totalCount] = await prisma.$transaction([
        prisma.job.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            orderBy: {
                [sortBy]: sortOrder
            }
        }),
        prisma.job.count({
            where: whereClause
        })
    ]);

    return {
        data: jobs,
        meta: {
            totalItems: totalCount,
            currentPage: Math.floor(skip / take) + 1,
            itemsPerPage: take,
            totalPages: Math.ceil(totalCount / take)
        }
    };
};



export const getApplicationsByJobId =  async (jobId) => {
    return await prisma.job.findUnique({
        where:{id : jobId},
        include:{applications: true}
    })
}