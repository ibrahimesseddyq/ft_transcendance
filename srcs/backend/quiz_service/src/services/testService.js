import { prisma } from '../config/prisma.js';
import * as testRepository from '../repositories/testRepository.js'
import {HttpException } from '../utils/httpExceptions.js';

const createTest = async (testData) => {
    return await testRepository.createTest(testData);
}

const updateTest =  async (testId, updateData) => {
    return  await testRepository.updateData(testId,updateData);  

}

const getTestById = async (testId) => {
    return await testRepository.getTestById(testId);
}

export {

}