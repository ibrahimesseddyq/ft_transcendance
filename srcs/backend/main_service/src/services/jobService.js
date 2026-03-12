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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    const take = limit;
    const { 
        page: _page, 
        limit: _limit, 
        sortBy: _sortBy, 
        sortOrder: _sortOrder, 
        ...filters 
    } = req.query;
    const result = await jobRepository.findManyJobs(filters, skip, take, sortBy, sortOrder);
};

export const getApplicaticationsBJobId = async (jobId) => {
    const job =  await jobRepository.getApplicationsByJobId(jobId);
    if (!job)
        throw new HttpException(404, 'job not found');
    return job.applications;
}
