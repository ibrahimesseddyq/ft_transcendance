const data = require('../config/env');
const profileservice = require('../services/profileService');

const createProfile =  async (req, res, next) => {
    try {
        console.log("**************", req.body);
        const id =  req.params?.id || req.body.userId;
        console.log("id:", id);
        const profile = await profileservice.createProfile(id, {
            body: req.body,
            files:req.files
        });
        res.status(201)
        .json({
            status: true,
            message : "profile created successfully",
            data: profile
        });
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const id = req.params?.id || req.body.userId;
        const updatedProfile = await profileservice.updateProfile(id,{
            body : req.body,
            files: req.files
        });
        res.status(200)
        .json({
            status: true,
            message : "profile updated successfully",
            data: updatedProfile
        })
    } catch (error) {
        next(error)
    }
}

const getProfile = async (req, res, next) => {
    try {
        const profile = await profileservice.getProfile(req.params.id);
        res.status(200)
        .json({
            status : true,
            data: profile
        })
    } catch (error) {
        next(error)
    }
}
const deleteProfile = async (req, res, next) => {
    try {
        await profileservice.deleteProfile(req.params.id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

const deleteResume = async (req, res, next) => {
    try {
        await profileservice.deleteResume(req.params.id);
        res.status(204)
        .end();
    } catch (error) {
        next(error)
    }
}

const updateResume = async (req, res, next) => {
    try {
        const updatedResume =  await profileservice.updateResume(req.params.id, req.file)
        res.status(200)
        .json({
            status : true,
            message : "profile updated successfully",
            data: updatedResume
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProfile,
    updateProfile,
    getProfile,
    deleteProfile,
    deleteResume,
    updateResume
}