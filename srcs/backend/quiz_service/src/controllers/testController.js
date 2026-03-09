import * as testSevice from '../services/testService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTest =  asyncHandler( async (req, res, next) => {
    const test = await testSevice.createTest(req.body);
    res.status(201)
    .json({
        success: true,
        data: test
    }) 
})

export const updateTest = asyncHandler(async (req, res, next) => {
    const test = await testSevice.updateTest(req.params?.id, req.body);
    res.status(200)
    .json({
        success: true,
        data: test
    })
})

export const getTestById =  asyncHandler(async (req, res, next) => {
    const test =  await testSevice.getTestById(req.params?.id);
    res.status(200)
    .json({
        success : true,
        data: test
    })
})

export const deleteTest = asyncHandler( async (req, res, next) => {
    await testSevice.deleteTest(req.params?.id);
    res.status(204)
    .end();
})

export const getTests = asyncHandler(async (req, res, next) => {
    const result = await testSevice.getTests(req.query);
    res.status(200)
    .json({
        success: true,
        data: result
    })
})