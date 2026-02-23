import * as userRepository from '../repositories/userRepository.js'
import argon2 from 'argon2';
import {HttpException} from '../utils/httpExceptions.js';
import crypto from 'crypto';
import * as fileService from './fileService.js';

export const createUser = async (userData) => {
    const {password, ...data} = userData;
    const passwordHash = await argon2.hash(password);
    const user = await userRepository.createUser({passwordHash, ...data})
    delete user.passwordHash;
    return user;
}

export const findUserOrCreate = async (profile) => {
    const email = profile.emails[0].value.toLowerCase().trim();
    let user = await userRepository.getByEmail(email);
    if (user) {
        delete user.passwordHash;
        delete user.refreshToken;
        return user;
    }
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await argon2.hash(randomPassword);

    user = await userRepository.createUser({
        email,
        firstName: profile.name.givenName || profile.displayName.split(' ')[0] || 'User',
        lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
        passwordHash,
        avatarUrl: profile.photos?.[0]?.value || null,
        role: 'candidate',
        isVerified: true
    });

    delete user.passwordHash;
    delete user.refreshToken;
    return user;
}

export const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    return user;
}

export const getUserByEmail = async (email) => {
    const user = await userRepository.getByEmail(email);
    if (!user)
        return;
    return user;
}

export const updateUser = async (userId, updateData) => {
    await getUserById(userId);
    const allowedFields = ['twoFAEnabled', 'twoFASecret','twoFATempSecret', 'firstName', 'lastName', 'phone', 'avatarUrl','refreshToken', "isVerified", "firstLogin"];
    const filteredData = {};
    
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined)
            filteredData[field] = updateData[field];
    })
    if(Object.keys(filteredData).length === 0)
        throw new HttpException(400,'No valid fields to update');
    return await userRepository.updateUser(userId,filteredData);
}

export const deleteUser = async (userId) => {
    const user =  await getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    await userRepository.deleteUser(userId);
}

export const getUsers = async (filters) => {
    return await userRepository.getUsers(filters);
}

export const uploadAvatar = async (userId, file) => {
    const user = await userRepository.getUserById(userId);
    const {avatarUrl} =  await fileService.saveAvatar(userId,file);
    if (avatarUrl !== user.avatarUrl) {
        await fileService.deleteFile(user.avatarUrl);
    }
    const updatedUser = await userRepository.updateUser(userId, {avatarUrl});
    return updatedUser;
}
export const detletAvatar =  async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    if (!user.avatarUrl)
        throw new HttpException(400, "avatar not set yet");
    await fileService.deleteFile(user.avatarUrl);
    await userRepository.updateUser(userId, {avatarUrl : null});
}

export const getAvatar = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    if (!user.avatarUrl)
        throw new HttpException(404, 'avatar not setted yet');
    return user.avatarUrl;
}
