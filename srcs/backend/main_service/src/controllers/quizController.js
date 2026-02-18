import *  as quizService from '../services/quizService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const startTest  = asyncHandler(async (req, res, next) => {
    const test  = await quizService.startTest(req.params.id);
    res.status(200)
    .json({
        success: true,
        data: test
    }) 
})

export const submitTest =  asyncHandler(async (testId, answers) => {
    const test = await quizService.submitTest(testId, answers);
    res.status(200)
    .json({
        success: true,
        data: test
    })
})