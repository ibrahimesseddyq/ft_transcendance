const jobPhaseService = require('../services/jobPhaseService');

const createJobPhase = async (req, res, next) => {
	try {
		const jobPhase = await jobPhaseService.createJobPhase(req.body);
		res.status(201)
		.json({
			status : true,
			data:jobPhase
		});

	} catch (error) {
		next(error)
	}
}

const updateJobPhase = async (req, res, next) => {
	try {
		const jobPhase = await jobPhaseService.updateJobPhase(req.params.id,req.body);
		res.status(200)
		.json({
			status: true,
			data: jobPhase
		})
	} catch (error) {
		next(error);
	}
}

const getJobPhaseById = async (req, res, next) => {
	try {
		const jobPhase = await jobPhaseService.getJobPhaseById(req.params.id);
		res.status(200)
		.json({
			status:true,
			data: jobPhase
		})
	} catch (error) {
		next(error)
	}
}

const deleteJobPhase = async (req, res, next) => {
	try {
		await jobPhaseService.deleteJobPhase(req.params.id);
		res.status(204);
	} catch (error) {
		next(error);
	}
}

const getJobPhases = async(req, res, next) => {
	try {
		const result = await jobPhaseService.getJobPhases(req.params.id);
		res.status(200)
		.json({
			status: true,
			data: result
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	createJobPhase,
	updateJobPhase,
	getJobPhaseById,
	deleteJobPhase,
	getJobPhases
}
