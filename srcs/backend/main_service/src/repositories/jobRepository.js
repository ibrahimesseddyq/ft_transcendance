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

const findManyJobs = async (skip = 0, take = 10, filter =[]) =>
{
    
}

module.exports = {
    findManyJobs,
    deleteJob,
    updateJob,
    createJob,
    findJobById
};