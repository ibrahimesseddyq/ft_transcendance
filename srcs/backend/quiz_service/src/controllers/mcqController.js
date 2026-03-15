import * as mcqService from '../services/mcqService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createMcq = asyncHandler( async (req, res, next) => {
    const mcq = await mcqService.createMcq(req.body);
    res.status(201)
    .json({
        success: true,
        data: mcq
    })
});

export const updateMcq = asyncHandler( async (req, res, next) => {
    const mcq = await mcqService.updateMcq(req.params?.id, req.body);
    res.status(200)
    .json({
        success: true,
        data: mcq
    })
})

export const deleteMcq = asyncHandler(async (req, res, next) => {
    await mcqService.deleteMcq(req.params?.id);
    res.status(204)
    .end();
})

export const getMcqById = asyncHandler(async (req, res, next) => {
    const mcq = await mcqService.getMcqById(req.params?.id);
    res.status(200)
    .json({
        success: true,
        data: mcq,
    })
})

export const getManyMcqs = asyncHandler( async (req, res, next) => {
   const result =  await mcqService.getManyMcqs(req.query);
    res.status(200)
    .json({
        success: true,
        data: result
    })
})