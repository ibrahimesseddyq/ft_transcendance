import * as jobService from '../services/jobService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createJob = asyncHandler(async (req,res,next) => {
	const job = await jobService.createJob(req.body)
	res.status(201)
	.json({
		success: true,
		message: "job created successfully",
		data: job
	})
})

export const updateJob = asyncHandler(async (req,res,next) => {
	const job = await jobService.updateJob(req.params.id,req.body);
	res.status(200)
	.json({
		success: true,
		message: "job updated successfully",
		data: job
	})
})

export const deleteJob = asyncHandler(async (req,res,next) => {
	await jobService.deleteJob(req.params.id);
	res.status(204)
	.end();
})

export const getJobById = asyncHandler(async(req,res,next) => {
	const job = await jobService.getJobById(req.params.id);
	res.status(200)
	.json({
		success: true,
		data: job
	})
})

export const getJobs = asyncHandler(async (req, res, next) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.query || {};
    const queryOptions = {
        page: page !== undefined ? parseInt(page, 10) : undefined,
        limit: limit !== undefined ? parseInt(limit, 10) : undefined,
        sortBy,
        sortOrder,
        filters,
    };
    const result = await jobService.getJobs(queryOptions);
    res.status(200).json({
        success: true,
        data: result?.data,
        meta: result?.meta
    });
})

export const getApplicationsByJobId = asyncHandler(async (req, res, next) => {
	const jobId =  req.params?.id;
    const result = await jobService.getApplicaticationsBJobId(jobId);
    res.status(200).json({
        status: true,
        data: result
    });
})
