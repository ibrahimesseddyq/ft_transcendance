import *  as quizService from '../services/quizService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const startTest = asyncHandler(async (req, res, next) => {
    const test = await quizService.startTest({
        testId: req.params.testId,
        userId: req.user.id,
        applicationPhaseId: req.query.applicationPhaseId
    });
    res.status(200).json({ success: true, data: test });
});


export const submitTest = asyncHandler(async (req, res, next) => {
    const io = req.app.get('io');
    const test = await quizService.submitTest(
        { ...req, body: { ...req.body, userId: req.user.id } },
        io
    );
    res.status(200).json({ success: true, data: test });
});