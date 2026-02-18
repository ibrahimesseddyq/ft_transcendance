import * as userService from '../services/userService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req,res,next) => {
    const user = await userService.createUser(requestAnimationFrame.body);
    res.status(201).json({
        success: true,
        message: 'user created successfully',
        data: user
    })
})

export const getUserById = asyncHandler(async (req,res,next) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
        success: true,
        data : user
    })
})

export const updateUser = asyncHandler(async (req,res,next) => {
    const user = await userService.updateUser(req.params.id,req.body);
    res.status(200).json({
        success:true,
        message:"user update successfully",
        data:user
    })
})

export const deleteUser = asyncHandler(async (req,res,next) => {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
})

export const listUsers = asyncHandler(async (req,res,next) => {
    const result = await userService.listUsers({});
    res.status(200).json({
        success : true,
        data :result
    })
})

export const deleteAvatar = asyncHandler(async (req, res, next) => {
    await userService.detletAvatar(req.params.id);
    res.status(204).end();
})

export const uploadAvatar = asyncHandler(async(req, res, next) => {
    const avatar = await userService.uploadAvatar(req.params.id, req.file);
    res.status(201)
    .json({
        success: true,
        message: 'avatar uploaded successfully',
        data: avatar
    })
})

export const getAvatar = asyncHandler(async (req, res, next) => {
    const avatar =  await userService.getAvatar(req.params.id);
    res.status(200)
    .json({
        success: true,
        data: avatar
    })
})
