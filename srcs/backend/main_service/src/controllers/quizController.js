import { application } from 'express';
import *  as quizService from '../services/quizService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const startTest  = asyncHandler(async (req, res, next) => {
    console.log("req.query.userId = ", req.query.userId);
    console.log("req.query.applicationPhaseId = ", req.query.applicationPhaseId);
    const test  = await quizService.startTest({
        testId: req.params.testId,
        userId: req.query.userId,
        applicationPhaseId: req.query.applicationPhaseId
    });
    res.status(200)
    .json({
        success: true,
        data: test
    })
})

export const submitTest =  asyncHandler(async (req, res, next) => {
    const test = await quizService.submitTest(req);
    res.status(200)
    .json({
        success: true,
        data: test
    })
})