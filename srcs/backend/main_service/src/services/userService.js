const userRepository = require('../repositories/userRepository')
const argon2 = require('argon2');
const {HttpException} = require('../utils/httpExceptions');
const crypto = require('crypto');
const fileService =  require('./fileService');

const createUser = async (userData) => {
    const {password, ...data} = userData;
    const passwordHash = await argon2.hash(password);
    const user = await userRepository.createUser({passwordHash, ...data})
    delete user.passwordHash;
    return user;
}

const findUserOrCreate = async (profile) => {
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

const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        return;
    return user;
}

const getUserByEmail = async (email) => {
    const user = await userRepository.getByEmail(email);
    if (!user)
        return;
    return user;
}

const updateUser = async (userId, updateData) => {
    await getUserById(userId);
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatarUrl','refreshToken', "isVerified"];
    const filteredData = {};
    
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined)
            filteredData[field] = updateData[field];
    })
    if(Object.keys(filteredData).length === 0)
        throw new HttpException(400,'No valid fields to update');
    return await userRepository.updateUser(userId,filteredData);
}

const deleteUser = async (userId) => {
    const user =  await getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    await userRepository.deleteUser(userId);
}

const getUsers = async (filters) => {
    return await userRepository.getUsers(filters);
}

const uploadAvatar = async (userId, file) => {
    const user = await userRepository.getUserById(userId);
    const {avatarUrl} =  await fileService.saveAvatar(userId,file);
    if (avatarUrl !== user.avatarUrl) {
        await fileService.deleteFile(user.avatarUrl);
    }
    const updatedUser = await userRepository.updateUser(userId, {avatarUrl});
    return updatedUser;
}
const detletAvatar =  async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, "user not found");
    if (!user.avatarUrl)
        throw new HttpException(400, "avatar not set yet");
    await fileService.deleteFile(user.avatarUrl);
    await userRepository.updateUser(userId, {avatarUrl : null});
}

const getAvatar = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user)
        throw new HttpException(404, 'user not found');
    if (!user.avatarUrl)
        throw new HttpException(404, 'avatar not setted yet');
    return user.avatarUrl;
}
module.exports = {
    createUser,
    findUserOrCreate,
    deleteUser,
    getUsers,
    updateUser,
    getUserByEmail,
    getUserById,
    getAvatar,
    detletAvatar,
    uploadAvatar,
};