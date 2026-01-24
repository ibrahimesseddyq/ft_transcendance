const jobRepository = require('../repositories/jobRepository');
const {HttpException} = require('../utils/httpExceptions');


const createJob = async (jobData) =>
{
    const job = await jobRepository.createJob(jobData);
    return job;
}

const updateJob = async (jobId, updateData) =>
{
    if (!await jobRepository.findJobById(jobId))
        throw new HttpException(400, 'job does not exists');
    const job = await jobRepository.updateJob(jobId, updateData);
    return job;
}

const getJobById = async (jobId) =>
{
    const job = await jobRepository.findJobById(jobId);
    if (!job)
        throw new HttpException(400, "job not found");
    return job;
}

const deleteJob =  async(jobId) =>
{
    if (!await jobRepository.findJobById(jobId))
        throw new HttpException(400, "job not found");
    await jobRepository.deleteJob(jobId);
}

const getJobs = async (filters) =>
{
    console.log("I'm in getJobs function");
    console.log("this is the filters = ", filters);
    return await jobRepository.findManyJobs(filters);
}
 
module.exports = {
    getJobs,
    deleteJob,
    getJobById,
    updateJob,
    createJob
}