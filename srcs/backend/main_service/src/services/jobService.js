import * as jobRepository from '../repositories/jobRepository';
import {HttpException} from '../utils/httpExceptions';


export const createJob = async (jobData) => {
    const job = await jobRepository.createJob(jobData);
    return job;
}

export const updateJob = async (jobId, updateData) => {
    if (!await jobRepository.findJobById(jobId))
        throw new HttpException(404, 'job does not exists');
    const job = await jobRepository.updateJob(jobId, updateData);
    return job;
}

export const getJobById = async (jobId) => {
    const job = await jobRepository.findJobById(jobId);
    if (!job)
        throw new HttpException(404, "job not found");
    return job;
}

export const deleteJob =  async(jobId) => {
    if (!await jobRepository.findJobById(jobId))
        throw new HttpException(404, "job not found");
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
