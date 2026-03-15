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

export const getJobs = async (req) => {
    const page = parseInt(req.query?.page, 10) || 1;
    const limit = parseInt(req.query?.limit, 10) || 10;
    const sortBy = req.query?.sortBy || 'createdAt';
    const sortOrder = req.query?.sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    const take = limit;
    const allowedFilters = ['keyword', 'skills', 'department', 'employmentType', 'isRemote', 'status'];
    const filters = {};
    for (const key of allowedFilters) {
        if (req.query?.[key] !== undefined && req.query?.[key] !== '') {
            filters[key] = req.query[key];
        }
    }
    const result = await jobRepository.findManyJobs(filters, skip, take, sortBy, sortOrder);
    return result;
};

export const getApplicaticationsBJobId = async (jobId) => {
    const job =  await jobRepository.getApplicationsByJobId(jobId);
    if (!job)
        throw new HttpException(404, 'job not found');
    return job.applications;
}
