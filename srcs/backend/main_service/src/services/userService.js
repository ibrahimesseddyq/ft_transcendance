import * as userRepository from '../repositories/userRepository.js'
import argon2 from 'argon2';
import {HttpException} from '../utils/httpExceptions.js';
import crypto from 'crypto';
import * as fileService from './fileService.js';


export const createUser = async (userData) => {
    const {password, ...data} = userData;
    const passwordHash = await argon2.hash(password);
    return await userRepository.createUser({passwordHash, ...data})
}

export const findUserOrCreate = async (profile) => {
    const email = profile.emails[0].value.toLowerCase().trim();
    let user = await userRepository.getUserByEmail(email);
    if (user) 
        return user;
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await argon2.hash(randomPassword);
    return await userRepository.createUser({
        email,
        firstName: profile.name.givenName || profile.displayName.split(' ')[0] || 'User',
        lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
        passwordHash,
        avatarUrl: profile.photos?.[0]?.value || null,
        role: 'candidate',
        isVerified: true,
        firstLogin: true
    });
}

export const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    return user;
}

export const getUserByEmail = async (email) => {
    return await userRepository.getUserByEmail(email);
}

export const updateUser = async (userId, updateData) => {
    return await userRepository.updateUser(userId,updateData);
}

export const deleteUser = async (userId) => {
    await userRepository.deleteUser(userId);
}

export const getUserApplications = async (userId) => {
    const applications = await userRepository.getUserApplications(userId);
    if (!applications)
        throw new HttpException(400, 'user not found');
    return applications;
}

export const getUserJobs = async (userId) => {
    const jobs = await  userRepository.getUserJobs(userId);
    if (!jobs)
        throw new HttpException(400, 'user not found');
    return jobs;
}

export const getUsers = async (filters) => {
    return await userRepository.getUsers(filters);
}

export const uploadAvatar = async (userId, file) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    const {avatarUrl} =  await fileService.saveAvatar(userId,file);
    const tasks = [userRepository.updateUser(userId, {avatarUrl})];
    if (avatarUrl !== user.avatarUrl)
        tasks.push(fileService.deleteFile(user.avatarUrl));
    await Promise.all(tasks);
    return tasks[0];
}


export const deleteAvatar =  async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    if (!user.avatarUrl)
        throw new HttpException(400, "avatar not set yet");
    await Promise.all([
        fileService.deleteFile(user.avatarUrl),
        userRepository.updateUser(userId, {avatarUrl : null})
    ])
}

export const getAvatar = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    if (!user.avatarUrl)
        throw new HttpException(404, 'avatar not setted yet');
    return user.avatarUrl;
}
