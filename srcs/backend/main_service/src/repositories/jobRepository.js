const env = require('../config/env');
const {prisma} = require('../config/prisma');


const findJobById = async (jobId) =>
{
    return await prisma.job.findUnique(
        {
            where : {id : jobId},
            include : {}
        }
    )
}

const createJob = async  (jobData) =>
{
    console.log("jobData : ", jobData);
    return await prisma.job.create({
        data : jobData 
    })
}

const updateJob = async (jobId, updateData) =>
{
    if (await findJobById(jobId))
    {
        return await prisma.job.update({
            where : {id : jobId},
            data: updateData,
            include : {

            }
        })
    }
}

const deleteJob = async (jobId) =>
{
    if (await findJobById(jobId))
    {
        return await prisma.job.delete({where :{ id : jobId} });
    }
}

const findManyJobs = async (filters) => {
    const isRemote = 
        filters.isRemote === "true" ? true : 
        filters.isRemote === "false" ? false : 
        undefined;

    const statusArray = filters.status ? filters.status.split(',') : undefined;
    const skillsArray = filters.skills ? filters.skills.split(',') : undefined;
    const deptArray = filters.department ? filters.department.split(',') : undefined;
    const typeArray = filters.employmentType ? filters.employmentType.split(',') : undefined;

    const jobs = await prisma.job.findMany({
        where: { 
            title: filters.title || undefined,
            department: deptArray ? { in: deptArray } : undefined,
            location: filters.location || undefined,
            employmentType: typeArray ? { in: typeArray } : undefined,
            status: statusArray ? { in: statusArray } : undefined,
            isRemote: isRemote,
            ...(skillsArray && {
              OR: skillsArray.map(skill => ({
                skills: {contains: skill.trim()}
              }))
            })
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