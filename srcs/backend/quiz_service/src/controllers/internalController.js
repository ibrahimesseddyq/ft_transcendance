import { getTestById } from '../repositories/testRepository.js';
import * as internalService from '../services/internalService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getTestForEvalution =  asyncHandler(async (req, res, next) => {
    const test = await internalService.getTestForEvalution(req.params?.testId);
    res.status(200)
    .json({
        success: true,
        data: test
    })
})

export const evaluateTest = asyncHandler(async (req, res, next) => {
    const result =  await evaluateTest.evaluateTest(req.body.testId, req.body.answers);
    res.status(200)
    .json({
        success: true,
        data: result
    })
})