import {prisma} from '../config/prisma';

export const createApplicationPhase = async (data) => {
    return await prisma.applicationPhase.create({
        data
    })
}

export const   updateApplicationPhase = async (applicationPhaseId, data) => {
    return await prisma.applicationPhase.update({
        where:{id : applicationPhaseId},
        data: data
    })
}

export const getApplicationPhaseById = async (applicationPhaseId) => {
    return await prisma.applicationPhase.findUnique({
        where : {id : applicationPhaseId}
    })
}
