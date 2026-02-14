import * as testRepository from '../repositories/testRepository.js'

export const createTest = async (testData) => {
    return await testRepository.createTest(testData);
}

export const updateTest =  async (testId, updateData) => {
    return  await testRepository.updateData(testId,updateData);  
}

export const getTestById = async (testId) => {
    return await testRepository.getTestById(testId);
}

export const deleteTest = async (testId) => {
    return await testRepository.deleteTest(testId);
}

export const gettests = async (searchFilters) => {
    const {skip, take,...filters} =  searchFilters;
    return await testRepository.gettests(skip, take, filters);
}