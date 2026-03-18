import * as jobPhaseService from '../services/jobPhaseService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createJobPhase = asyncHandler( async (req, res, next) => {
	const jobPhase = await jobPhaseService.createJobPhase(req.body);
	res.status(201)
	.json({
		success: true,
		data:jobPhase
	});
})

export const updateJobPhase = asyncHandler( async (req, res, next) => {
	const jobPhase = await jobPhaseService.updateJobPhase(req.params.id,req.body);
	res.status(200)
	.json({
		success: true,
		data: jobPhase
	})
})

export const getJobPhaseById = asyncHandler( async (req, res, next) => {
	const jobPhase = await jobPhaseService.getJobPhaseById(req.params.id);
	res.status(200)
	.json({
		success: true,
		data: jobPhase
	})
})

export const deleteJobPhase = asyncHandler( async (req, res, next) => {
	await jobPhaseService.deleteJobPhase(req.params.id);
	res.status(204)
	.end();
})

export const getJobPhases = asyncHandler( async(req, res, next) => {
	const result = await jobPhaseService.getJobPhases(req.params.id);
	res.status(200)
	.json({
		success: true,
		data: result
	})
})
