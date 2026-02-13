import { prisma, Prisma } from "../config/prisma";

const createMcq =  async (mcqData) => {
    return await prisma.mcq.create({
        mcqData
    })
}

const updateMcq = async (mcqId, updateData) => {
    return await prisma.mcq.update({
        where: {id : mcqId},
        updateData
    })
}

const getMcqById =  async (mcqId) => {
    return await prisma.mcq.findUnique({
        where: {id : mcqId}
    })
}

const deleteMcq = async (mcqId) => {
    return await prisma.mcq.delete({
        where : {id : mcqId}
    })
}

const getManyMcq = async (skip = 0 , take = 10, filters = []) => {
    return await prisma.mcq.findMany({
        skip,
        take,
        filters
    })
}

export {
    createMcq,
    updateMcq,
    getMcqById,
    deleteMcq,
    getManyMcq 
}