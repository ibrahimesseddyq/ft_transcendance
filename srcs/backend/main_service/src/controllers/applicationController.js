import * as applicationService from '../services/applicationService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getApplicaticationById =  asyncHandler(async (req, res, next) => {
    const id = req.params?.id;  
    const application = await applicationService.getApplicaticationById(id);
    res.status(200)
    .json({
        success: true,
        data: application
    })
})

export const submitApplication = asyncHandler(async (req, res, next) => {
    const io = req.app.get('io');
    const application = await applicationService.submitApplication(
        { ...req.body, candidateId: req.user.id },
        io
    );
    res.status(201).json({ success: true, data: application });
});

export const withdrawApplication = asyncHandler(async (req, res, next) => {
    const id = req.params?.id;
    await applicationService.withdrawApplication(id, req.user.id);
    res.status(204).end();
});

export const rejectApplication = asyncHandler( async (req, res, next) => {
    const id = req.params?.id;
    const io = req.app.get('io');
    await applicationService.rejectApplication(id, io);
    res.status(204)
    .end();
})

export const acceptApplication = asyncHandler( async (req, res, next) => {
    const id = req.params?.id;
    const io = req.app.get('io');
    await applicationService.acceptApplication(id, io);
    res.status(204)
    .end();
})

export const getApplicationPhases = asyncHandler( async (req, res, next) => {
    const id = req.params?.id;
    const result = await applicationService.getApplicaticationPhases(id);
    res.status(200)
    .json({
        success: true,
        data: result
    })
})

export const getCurrentPhase = asyncHandler( async (req, res, next) => {
    const id = req.params?.id;
    const currentPhase = await applicationService.getCurrentPhase(id);
    res.status(200)
    .json({
        success: true,
        data: currentPhase
    })
})

export const advance = asyncHandler( async (req, res, next) => {
    const id = req.params?.id;
    const nextPhase = await applicationService.advance(id);
    res.status(200)
    .json({
        success: true,
        data : nextPhase
    })
})

