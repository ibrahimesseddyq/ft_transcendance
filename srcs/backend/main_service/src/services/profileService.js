const data = require('../config/env');
const profileRepository =  require('../repositories/profileRepository');
const { HttpException } = require('../utils/httpExceptions');
const fileService = require('./fileService');
const userService = require('./userService');

const createProfile = async  (profileData, userId) => {
    const user = await userService.getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    const {resumeUrl} = await fileService.saveResume(userId,profileData.file);
    return await profileRepository.createProfile({
        userId,
        ...profileData.body,
        resumeUrl,
    })
}

const updateProfile = async (profileData, userId) => {
    const user = await userService.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    const updateData = {...profileData.body};
    if (profileData.file)
    {
        const {resumeUrl} = await fileService.saveResume(userId,profileData.file);
        if (profile.resumeUrl && profile.resumeUrl !== resumeUrl)
            await fileService.deleteFile(profile.resumeUrl);
        updateData.resumeUrl = resumeUrl;
    }
    return await profileRepository.updateProfile(userId, updateData);
}

const getProfile =  async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    return profile;
}

const deleteProfile = async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    if (profile.resumeUrl)
        await fileService.deleteFile(profile.resumeUrl);
    await profileRepository.deleteProfile(userId);
}

const deleteResume = async ()