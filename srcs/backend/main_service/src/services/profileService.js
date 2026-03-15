import  * as profileRepository from '../repositories/profileRepository.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as fileService from './fileService.js';
import * as userService from './userService.js';

// this updated need to be checked
export const createProfile = async (userId, profileData) => {
    const createData = { ...profileData.body };
    
    let avatarUrl = null;
    let resumeUrl = null;

    if (profileData.files?.avatar?.[0]) {
        const result = await fileService.saveAvatar(userId, profileData.files.avatar[0]);
        avatarUrl = result.avatarUrl;
    }
    if (profileData.files?.resume?.[0]) {
        const result = await fileService.saveResume(userId, profileData.files.resume[0]);
        resumeUrl = result.resumeUrl;
    }
    const tasks = [
        profileRepository.createProfile({
            ...createData,
            userId,
            resumeUrl
        })
    ];

    if (avatarUrl) {
        tasks.push(userService.updateUser(userId, { avatarUrl }));
    }

    const [profile, user] = await Promise.all(tasks);
    if (user && user.avatarUrl) {
        profile.user.avatarUrl = user.avatarUrl;
    }
    return profile;
}
export const updateProfile = async (userId, profileData) => {
    const [user, profile] = await Promise.all([
        userService.getUserById(userId),
        profileRepository.getProfileById(userId)
    ]);
    if (!user) throw new HttpException(404, 'user not found');
    if (!profile) throw new HttpException(404, 'profile not found');
    const updateData = { ...profileData.body };
    const [avatarResult, resumeResult] = await Promise.all([
        profileData.files?.avatar?.[0] 
            ? fileService.saveAvatar(userId, profileData.files.avatar[0]) 
            : Promise.resolve(null),
        profileData.files?.resume?.[0] 
            ? fileService.saveResume(userId, profileData.files.resume[0]) 
            : Promise.resolve(null)
    ]);
    const newAvatarUrl = avatarResult?.avatarUrl;
    const newResumeUrl = resumeResult?.resumeUrl;
    if (newResumeUrl) {
        updateData.resumeUrl = newResumeUrl;
    }
    const executionQueue = [];
    if (newResumeUrl && profile.resumeUrl && profile.resumeUrl !== newResumeUrl) {
        executionQueue.push(fileService.deleteFile(profile.resumeUrl));
    }
    if (newAvatarUrl && user.avatarUrl && user.avatarUrl !== newAvatarUrl) {
        executionQueue.push(fileService.deleteFile(user.avatarUrl));
    }
    const updateProfilePromise = profileRepository.updateProfile(userId, updateData);
    executionQueue.push(updateProfilePromise);
    let updateUserPromise = Promise.resolve(user);
    if (newAvatarUrl) {
        updateUserPromise = userService.updateUser(userId, { avatarUrl: newAvatarUrl });
        executionQueue.push(updateUserPromise);
    }
    await Promise.all(executionQueue);
    const updatedProfile = await updateProfilePromise;
    const updatedUser = await updateUserPromise;
    if (updatedUser && updatedUser.avatarUrl) {
        if (!updatedProfile.user) updatedProfile.user = {}; 
        updatedProfile.user.avatarUrl = updatedUser.avatarUrl;
    }
    return updatedProfile;
};

export const getProfile =  async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    return profile;
}

export const deleteProfile = async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    if (profile.resumeUrl)
        await fileService.deleteFile(profile.resumeUrl);
    await profileRepository.deleteProfile(userId);
}

export const deleteResume = async (userId) => {
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    await Promise.all([
        profileRepository.updateProfile(userId, {resumeUrl : null}),
        fileService.deleteFile(profile.resumeUrl)
    ])
}

export const updateResume = async (userId, file) => {
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
