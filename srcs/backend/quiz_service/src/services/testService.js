import * as testRepository from '../repositories/testRepository.js'

export const createTest = async (testData) => {
    return await testRepository.createTest(testData);
}

export const updateTest =  async (testId, updateData) => {
    return  await testRepository.updateTest(testId,updateData);  
}

export const getTestById = async (testId) => {
    return await testRepository.getTestById(testId);
}

export const deleteTest = async (testId) => {
    return await testRepository.deleteTest(testId);
}

export const getTests = async (searchFilters) => {
    const {skip, take,...filters} =  searchFilters;
    
    return await testRepository.getTests(skip, take, filters);
}