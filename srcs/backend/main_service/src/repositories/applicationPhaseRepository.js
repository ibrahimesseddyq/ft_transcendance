const {prisma} =  require('../config/prisma');

const createApplicationPhase = async (data) => {
    return await prisma.applicationPhase.create({
        data
    })
}

const   updateApplicationPhase = async (applicationPhaseId, data) => {
    return await prisma.applicationPhase.update({
        where:{id : applicationPhaseId},
        data: data
    })
}

const getApplicationPhaseById = async (applicationPhaseId) => {
    return await prisma.applicationPhase.findUnique({
        where : {id : applicationPhaseId}
    })
}
module.exports = {
    updateApplicationPhase,
    createApplicationPhase,
    getApplicationPhaseById
}