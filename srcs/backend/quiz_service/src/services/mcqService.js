import * as mcqRepository from '../repositories/mcqRepository';

export const createMcq =  async (mcqData) => {
    return await mcqRepository.createMcq(mcqData);
}

export const updateMcq = async (mcqId, updateData) => {
    return await mcqRepository.updateMcq(mcqId, updateData);
}

export const deleteMcq = async (mcqId) => {
    return await mcqRepository.deleteMcq(mcqId);
}

export const getMcqById = async (mcqId) => {
    return await mcqRepository.getManyMcq(mcqId);
}

export const getManyMcqs = async (mcqFilter) => {
    const {skip, take, ...filers} = mcqFilter;
    return await mcqRepository.getManyMcqs(skip,take,filers);
}