const env = require('../config/env');
const {prisma} = require('../config/prisma');


const findJobById = async (jobId) => {
    return await prisma.job.findUnique({
        where : {id : jobId},
        include : {}
    })
}

const createJob = async  (jobData) => {

    return await prisma.job.create({
        data : jobData 
    })
}

const updateJob = async (jobId, updateData) => {
    return await prisma.job.update({
        where : {id : jobId},
        data: updateData,
    })
}

const deleteJob = async (jobId) => {
    return await prisma.job.delete({where :{ id : jobId} });
}

const findManyJobs = async (filters) => {
    const { keyword } = filters;
    const isRemoteBool = 
        filters.isRemote === "true" ? true : 
        filters.isRemote === "false" ? false : 
        undefined;

    const statusArray = filters.status ? filters.status.split(',') : undefined;
    const skillsArray = filters.skills ? filters.skills.split(',') : undefined;
    const deptArray = filters.department ? filters.department.split(',') : undefined;
    const typeArray = filters.employmentType ? filters.employmentType.split(',') : undefined;

    const jobs = await prisma.job.findMany({
        where: {
            ...(keyword && {
                OR: [
                    { title: { contains: keyword,} },
                    { description: { contains: keyword,} },
                    { department: { contains: keyword,} },
                    { employmentType: { contains: keyword,} },
                    { skills: { contains: keyword,} },
                ]
            }),
            ...(skillsArray && {
              OR: skillsArray.map(skill => ({
                skills: {contains: skill.trim()}
              }))
            }),
            department: deptArray ? { in: deptArray } : undefined,
            employmentType: typeArray ? { in: typeArray } : undefined,
            status: statusArray ? { in: statusArray} : undefined,
            isRemote: isRemoteBool,
        },
    });

    return jobs;
};

module.exports = {
    findManyJobs,
    deleteJob,
    updateJob,
    createJob,
    findJobById
};