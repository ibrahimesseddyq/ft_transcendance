import {prisma} from "../config/prisma.js";

export const createMcq =  async (mcqData) => {
    return await prisma.mcq.create({
        data: mcqData
    })
}

export const updateMcq = async (mcqId, updateData) => {
    return await prisma.mcq.update({
        where: {id : mcqId},
        data: updateData
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

export const getManyMcqs = async (mcqFilter) => {
    return await mcqRepository.getManyMcqs();
};
