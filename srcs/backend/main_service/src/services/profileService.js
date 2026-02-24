import  * as profileRepository from '../repositories/profileRepository.js';
import {HttpException} from '../utils/httpExceptions.js';
import * as fileService from './fileService.js';
import * as userService from './userService.js';

export const createProfile = async  (userId , profileData) => {
    const createData =  {...profileData.body};
    const uploadTasks = [];
    const tasks = [];
    if (profileData.files?.avatar?.[0])
        uploadTasks.push(fileService.saveAvatar(userId, profileData.files.avatar[0]))     
    if (profileData.files?.resume?.[0])
        uploadTasks.push(fileService.saveResume(userId, profileData.files.resume[0]))
    const [avatarUrl,resumeUrl] = await Promise.all(tasks)
    tasks.push(profileRepository.createProfile({
        ...createData,
        userId,
        resumeUrl
    }))
    if (avatarUrl)
        tasks.push(userService.updateUser(userId, {avatarUrl}))
    await Promise.all(tasks2);
    return tasks[0];
}

export const updateProfile = async (userId, profileData) => {
    const user = await userService.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    const profile = await profileRepository.getProfileById(userId);
    if (!profile)
        throw new HttpException(404, "profile not found");
    const updateData = {...profileData.body};
    if (profileData.files?.resume?.[0]) {
        const {resumeUrl} = await fileService.saveResume(userId,profileData.files.resume[0]);
        if (profile.resumeUrl && profile.resumeUrl !== resumeUrl)
            await fileService.deleteFile(profile.resumeUrl);
        updateData.resumeUrl = resumeUrl;
    }
    if (profileData.files?.avatar?.[0])
    {
        const {avatarUrl} = await fileService.saveAvatar(userId,profileData.files.avatar[0])
        if (user.avatarUrl && user.avatarUrl !== avatarUrl)
        {
            await Promise.all([fileService.deleteFile(user.avatarUrl),
                userService.updateUser(userId, {avatarUrl})
            ])
        }
    }
    return await profileRepository.updateProfile(userId, updateData);
}

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
