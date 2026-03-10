import * as applicationPhaseRepository from '../repositories/applicationPhaseRepository.js';
import {HttpException} from '../utils/httpExceptions.js';

export const createApplicationPhase = async (data) => {
    return await applicationPhaseRepository.createApplicationPhase({
        applicationId: data.applicationId,
        phaseId: data.phaseId,
    });
}

export const updateApplicationPhase = async (applicationPhaseId, updateData) => {
    return  await applicationPhaseRepository.updateApplicationPhase(
        applicationPhaseId,
        updateData
    );
}

export const getApplicaticationPhaseById =  async (applicationPhaseId) => {
    const applicationPhase = await  applicationPhaseRepository.getApplicationPhaseById(applicationPhaseId)
    // console.log("applicationPhase :", applicationPhase)
    if (!applicationPhase)
        throw new HttpException(404, "application Phase not found");
    return applicationPhase;
}

