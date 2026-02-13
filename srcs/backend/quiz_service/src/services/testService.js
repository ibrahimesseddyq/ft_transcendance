import { prisma } from '../config/prisma.js';
import * as testRepository from '../repositories/testRepository.js'
import {HttpException } from '../utils/httpExceptions.js';

const createTest = async (testData) => {
    return await testRepository.createTest(testData);
}

const updateTest =  async (testId, updateData) => {
    try {
        return  await testRepository.updateData(testId,updateData);  
    } catch (error) {
        if (error instanceof prisma.PrismaClientKnownRequestError)
        {
            if (error.code === "P2025")
                throw new HttpException(404, "test not found");
        }
        throw error
    }
}

const getTestById = async (testId) => {
    try {
        return await testRepository.getTestById(testId);
    } catch (error) {
        if ( error instanceof prisma.PrismaClientKnownRequestError)
        {
            if (error.code === 'P2025')
                throw new HttpException(404, 'test not found');
        }
        throw error;
    }
}

export {

}