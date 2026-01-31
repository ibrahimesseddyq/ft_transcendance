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
    const isRemote = 
        filters.isRemote === "true" ? true : 
        filters.isRemote === "false" ? false : 
        undefined;
    const jobs =  await prisma.job.findMany(
      {
          where: { 
              title: filters.title || undefined,
              department: filters.department || undefined,
              location: filters.location || undefined,
              employmentType: filters.employmentType || undefined,
              status: filters.status || undefined,
              isRemote: isRemote,
          },
      });
    return (jobs);
};

module.exports = {
    findManyJobs,
    deleteJob,
    updateJob,
    createJob,
    findJobById
};