const applicationService = require('../services/applicationService');

const getApplicaticationById =  async (req, res, next) => {
    try {
        const id = req.params?.id;  
        const application = await applicationService.getApplicaticationById(id);
        res.status(200)
        .json({
            status:true,
            data: application
        })
    } catch (error) {
        next(error)
    }
}

const submitApplication = async (req, res, next) => {
    try {
        // console.log(req)
        const application = await applicationService.submitApplication(req.body);
        res.status(201)
        .json({
            status: true,
            data: application
        })
    } catch (error) {
        next(error)
    }
}

const withdrawApplication = async (req, res, next) => {
    try {
        const id = req.params?.id;
        await applicationService.withdrawApplication(id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

const rejectApplication = async (req, res, next) => {
    try {
        const id = req.params?.id;
        await applicationService.rejectApplication(id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

const getApplicationPhases = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const result = await applicationService.getApplicaticationPhases(id);
        res.status(200)
        .json({
            status : true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getCurrentPhase = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const currentPhase = await applicationService.getCurrentPhase(id);
        res.status(200)
        .json({
            status: true,
            data: currentPhase
        })
    } catch (error) {
        next(error)
    }
}

const advance = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const nextPhase = applicationService.advance(id);
        res.status(200)
        .json({
            status: true,
            data : nextPhase
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    submitApplication,
    getApplicaticationById,
    getApplicationPhases,
    withdrawApplication,
    rejectApplication,
    getCurrentPhase,
    advance
}
