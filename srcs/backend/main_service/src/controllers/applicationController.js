import * as applicationService from '../services/applicationService';

export const getApplicaticationById =  async (req, res, next) => {
    try {
        const id = req.params?.id;  
        const application = await applicationService.getApplicaticationById(id);
        res.status(200)
        .json({
            success: true,
            data: application
        })
    } catch (error) {
        next(error)
    }
}

export const submitApplication = async (req, res, next) => {
    try {
        const application = await applicationService.submitApplication(req.body);
        res.status(201)
        .json({
            success: true,
            data: application
        })
    } catch (error) {
        next(error)
    }
}

export const withdrawApplication = async (req, res, next) => {
    try {
        const id = req.params?.id;
        await applicationService.withdrawApplication(id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

export const rejectApplication = async (req, res, next) => {
    try {
        const id = req.params?.id;
        await applicationService.rejectApplication(id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

export const getApplicationPhases = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const result = await applicationService.getApplicaticationPhases(id);
        res.status(200)
        .json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getCurrentPhase = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const currentPhase = await applicationService.getCurrentPhase(id);
        res.status(200)
        .json({
            success: true,
            data: currentPhase
        })
    } catch (error) {
        next(error)
    }
}

export const advance = async (req, res, next) => {
    try {
        const id = req.params?.id;
        const nextPhase = applicationService.advance(id);
        res.status(200)
        .json({
            success: true,
            data : nextPhase
        })
    } catch (error) {
        next(error)
    }
}

