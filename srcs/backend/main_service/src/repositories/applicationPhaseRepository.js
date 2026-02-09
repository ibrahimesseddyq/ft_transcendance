const {prisma} =  require('../config/prisma');

const createApplicationPhase = async (data) => {
    return await prisma.applicationphase.create({
        data
    })
}

const   updateApplicationPhase = async (applicationPhaseId, data) => {
    return await prisma.applicationphase.update({
        where:{id : applicationPhaseId},
        data: data
    })
}

const getApplicationPhaseById = async (applicationPhaseId) => {
    return await prisma.applicationphase.findUnique({
        where : {id : applicationPhaseId}
    })
}
module.exports = {
    updateApplicationPhase,
    createApplicationPhase,
    getApplicationPhaseById
}