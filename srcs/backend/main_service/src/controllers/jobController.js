const jobService = require('../services/jobService');


const createJob = async (req,res,next) =>
{
	try {
		const job = await jobService.createJob(req.body)
		console.log("+++++++++++++++++++++++++", req.body);
		res.status(201)
		.json({
			status:true,
			message: "job created successfully",
			data:job
		})
	} catch (error) {
		next(error);	
	}
}

const updateJob = async (req,res,next) =>
{
	try {
		const job = await jobService.updateJob(req.params.id,req.body);
		res.status(200)
		.json({
			status:true,
			message:"job updated successfully",
			data:job
		})
	} catch (error) {
		next(error);
	}
}

const deleteJob = async (req,res,next) =>
{
	try {
		await jobService.deleteJob(req.params.id);
		res.status(204)
		.end();
	} catch (error) {
		next(error)
	}
}

const getJobById = async(req,res,next) =>
{
	try {
		const job = await jobService.getJobById(req.params.id);
		res.status(200)
		.json({
			status:true,
			data: job
		})
	} catch (error) {
		next(error)
	}
}

const getJobs = async (req,res,next) => 
{
	try {
		console.assert(false,"getJobs: need to be implemented");
		const result = await jobService.getJobs(); //should be filled
		res.status(200)
		.json({
			status:true,
			data: result
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	createJob,
	updateJob,
	deleteJob,
	getJobById,
	getJobs
}