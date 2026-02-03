const applicationPhaseRepository = require('../repositories/applicationPhaseRepository');
const applicationService = require('./applicationService');
const jobPhaseService = require('./jobPhaseService');
const {HttpException} = require('../utils/httpExceptions')

const createApplicationphase = async (data) => {
    const {applicationId, phaseId} = data;
    const application = await applicationService.getApplicaticationById(applicationId);
    const phase =  await jobPhaseService.getJobPhaseById(phaseId);
    if (!application)
        throw new HttpException(404, 'apllication not found');
    if (!phase)
        throw new HttpException(404, 'phase not found');
    return await applicationPhaseRepository.createApplicationPhase({
        applicationId: applicationId,
        phaseId:phaseId,
        interviews: []
    }) 
}

const updateApplicationPhase = async (applicationPhaseId, updateData) => {
    const applicationPhase =  await applicationPhaseRepository.getApplicationPhaseById(applicationPhaseId);
    if (!applicationPhase)
        throw new HttpException(404, 'application Phase not found');
    return await applicationPhaseRepository.updateApplicationPhase({
        applicationPhaseId,
        updateData
    })
}

const getApplicaticationById =  async (applicationPhaseId) => {
    const applicationPhase =  applicationPhaseRepository.getApplicationPhaseById(applicationPhaseId)
    if (!applicationPhase)
        throw new HttpException(404, "application Phase not found");
    return applicationPhase;
}
    
