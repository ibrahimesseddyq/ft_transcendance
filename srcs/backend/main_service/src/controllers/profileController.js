import * as profileservice from '../services/profileService.js';

export const createProfile =  async (req, res, next) => {
    try {
        // console.log(req);
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
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const id = req.params?.id || req.body.userId;
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
    } catch (error) {
        next(error)
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const profile = await profileservice.getProfile(req.params.id);
        res.status(200)
        .json({
            success: true,
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProfile = async (req, res, next) => {
    try {
        await profileservice.deleteProfile(req.params.id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

export const deleteResume = async (req, res, next) => {
    try {
        await profileservice.deleteResume(req.params.id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

export const updateResume = async (req, res, next) => {
    try {
        const updatedResume =  await profileservice.updateResume(req.params.id, req.file)
        res.status(200)
        .json({
            success: true,
            message : "profile updated successfully",
            data: updatedResume
        })
    } catch (error) {
        next(error)
    }
}
