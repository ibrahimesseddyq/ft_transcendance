import { prisma} from "../config/prisma.js";

export const createMcq =  async (mcqData) => {
    return await prisma.mcq.create({
        mcqData
    })
}

export const updateMcq = async (mcqId, updateData) => {
    return await prisma.mcq.update({
        where: {id : mcqId},
        updateData
    })
}

export const getMcqById =  async (mcqId) => {
    return await prisma.mcq.findUnique({
        where: {id : mcqId}
    })
}

export const deleteMcq = async (mcqId) => {
    return await prisma.mcq.delete({
        where : {id : mcqId}
    })
}

export const getManyMcqs = async (skip = 0 , take = 10, filters = []) => {
    return await prisma.mcq.findMany({
        skip,
        take,
        filters
    })
}
