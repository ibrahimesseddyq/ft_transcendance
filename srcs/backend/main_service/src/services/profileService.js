const profileRepository =  require('../repositories/profileRepository');
const { HttpException } = require('../utils/httpExceptions');
const fileService = require('./fileService');
const userService = require('./userService');

const createProfile = async (userId, profileData) => {
    const user = await userService.getUserById(userId);
    if (!user) throw new HttpException(404, "user not found");

    const existingProfile = await profileRepository.getProfileById(userId);
    if (existingProfile) throw new HttpException(400, "profile already exists");

    let avatarUrl = user.avatarUrl;

    if (profileData.files?.avatar?.[0]) {
        const savedFile = await fileService.saveAvatar(userId, profileData.files.avatar[0]);
        avatarUrl = savedFile.avatarUrl;
        
        if (avatarUrl) {
            await userService.updateUser(userId, { avatarUrl });
        }
    }

    let resumeUrl = null;
    if (profileData.files?.resume?.[0]) {
        const savedResume = await fileService.saveResume(userId, profileData.files.resume[0]);
        resumeUrl = savedResume.resumeUrl;
    }

    return await profileRepository.createProfile({
        ...profileData.body,
        userId,
        resumeUrl,
        avatarUrl
    });
};

const updateProfile = async (userId, profileData) => {
    const user = await userService.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    const updateData = {...profileData.body};
    if (profileData.files?.resume?.[0]) {
        const {resumeUrl} = await fileService.saveResume(profileData.files.resume[0]);
        if (profile.resumeUrl && profile.resumeUrl !== resumeUrl)
            await fileService.deleteFile(profile.resumeUrl);
        updateData.resumeUrl = resumeUrl;
    }
    if (profileData.files?.avatar?.[0])
    {
        const {avatarUrl} = await fileService.saveAvatar(userId,profileData.files.avatar[0])
        if (user.avatarUrl && user.avatarUrl !== avatarUrl)
            await fileService.deleteFile(user.avatarUrl);
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

const deleteResume = async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    await fileService.deleteFile(profile.resumeUrl);
    await profileRepository.updateProfile(userId, {resumeUrl : null});
}

const updateResume = async (userId, file) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    const {resumeUrl} = await fileService.saveResume(userId, file);
    if (!resumeUrl)
        throw new HttpException(400, "failed to update resume");
    if (profile.resumeUrl && profile.resumeUrl !== resumeUrl)
        await fileService.deleteFile(profile.resumeUrl);
    return await profileRepository.updateProfile(userId,{resumeUrl});
}

module.exports = {
    createProfile,
    updateProfile,
    getProfile,
    deleteProfile,
    deleteResume,
    updateResume
}