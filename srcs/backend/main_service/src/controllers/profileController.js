import * as profileservice from '../services/profileService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createProfile = asyncHandler(async (req, res, next) => {
    const id =  req.params?.id;
    const profile = await profileservice.createProfile(id, {
        body: req.body,
        files:req.files
    });
    res.status(201)
    .json({
        success: true,
        message : "profile created successfully",
        data: profile
    });
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    const id = req.params?.id || req.body.userId;
    console.log(req.body);
    const updatedProfile = await profileservice.updateProfile(id,{
        body : req.body,
        files: req.files
    });
    res.status(200)
    .json({
        success: true,
        message : "profile updated successfully",
        data: updatedProfile
    })
})

export const getProfile = asyncHandler(async (req, res, next) => {
    const profile = await profileservice.getProfile(req.params.id);
    res.status(200)
    .json({
        success: true,
        data: profile
    })
})

export const deleteProfile = asyncHandler( async (req, res, next) => {
    await profileservice.deleteProfile(req.params.id);
    res.status(204)
    .end();
})

export const deleteResume = asyncHandler(async (req, res, next) => {
    await profileservice.deleteResume(req.params.id);
    res.status(204)
    .end();
})

export const updateResume = asyncHandler(async (req, res, next) => {
    const updatedResume =  await profileservice.updateResume(req.params.id, req.file)
    res.status(200)
    .json({
        success: true,
        message : "profile updated successfully",
        data: updatedResume
    })
})
