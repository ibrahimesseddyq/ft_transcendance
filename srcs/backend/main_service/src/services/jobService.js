import * as jobRepository from '../repositories/jobRepository.js';
import {HttpException} from '../utils/httpExceptions.js';


export const createJob = async (jobData) => {
    return await jobRepository.createJob(jobData);
}

export const updateJob = async (jobId, updateData) => {
    return await jobRepository.updateJob(jobId, updateData);
}

export const getJobById = async (jobId) => {
    const job = await jobRepository.findJobById(jobId);
    if (!job)
        throw new HttpException(404, "job not found");
    return job;
}

export const deleteJob =  async(jobId) => {
    await jobRepository.deleteJob(jobId);
}

export const getJobs = async (filters) => {
    return await jobRepository.findManyJobs(filters);
}

export const getApplicaticationsBJobId = async (jobId) => {
    const job =  await jobRepository.getApplicationsByJobId(jobId);
    if (!job)
        throw new HttpException(404, 'job not found');
    return job.applications;
}
