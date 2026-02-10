const applicationPhaseRepository = require('../repositories/applicationPhaseRepository');
const {HttpException} = require('../utils/httpExceptions');

const createApplicationphase = async (data) => {
    const {applicationId, phaseId} = data;
    try {
        const applicationPhase = await applicationPhaseRepository.createApplicationPhase({
            applicationId: applicationId,
            phaseId:phaseId,
            notes: "",
            score: 0,
        });
         return applicationPhase;
    } catch (error) {
        if (error.code === "P2002")
            throw new HttpException(409,'application phase already exists');
        else if (error.code === "P2003")
            throw new HttpException(404, 'applicatioId or phaseId not valid');
        else 
            throw error;
    }
}

const updateApplicationPhase = async (applicationPhaseId, updateData) => {
    const applicationPhase =  await applicationPhaseRepository.updateApplicationPhase(
        applicationPhaseId,
        updateData
    );
    if (!applicationPhase)
        throw new HttpException(404, 'application Phase not found');
    return applicationPhase;
}

const getApplicaticationPhaseById =  async (applicationPhaseId) => {
    const applicationPhase = await  applicationPhaseRepository.getApplicationPhaseById(applicationPhaseId)
    if (!applicationPhase)
        throw new HttpException(404, "application Phase not found");
    return applicationPhase;
}

module.exports   =  {
    createApplicationphase,
    updateApplicationPhase,
    getApplicaticationPhaseById
}

