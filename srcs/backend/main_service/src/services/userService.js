const userRepository = require('../repositories/userRepository')
const argon2 = require('argon2');
const {HttpException} = require('../utils/httpExceptions');
const crypto = require('crypto');


const createUser = async (userData) =>
{
    const {password, ...data} = userData;
    const passwordHash = await argon2.hash(password);
    const user = await userRepository.createUser({passwordHash, ...data})
    delete user.passwordHash;
    return user;
}

const findUserOrCreate = async (profile) =>
{
    const email = profile.emails[0].value. toLowerCase().trim();
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
    firstName: profile.name.givenName || profile.displayName. split(' ')[0] || 'User',
    lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
    passwordHash,
    avatarUrl: profile.photos?.[0]?.value || null,
    role: 'candidate',
    });

    delete user.passwordHash;
    delete user.refreshToken;
    return user;
}

const getUserById = async (userId) =>
{
    const user = await userRepository.getUserById(userId);
    if (!user)
        return;
    return user;
}

const getUserByEmail = async (email) =>
{
    const user = await userRepository.getByEmail(email);
    if (!user)
        return;
    return user;
}

const updateUser = async (userId, updateData) =>
{
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

const deleteUser = async (userId) =>
{
    await getUserById(userId);
    //handle failure
    await userRepository.deleteUser(userId);
}

const getUsers = async (filters) =>
{
    return await userRepository.getUsers(filters);
}

module.exports = {
    createUser,
    findUserOrCreate,
    deleteUser,
    getUsers,
    updateUser,
    getUserByEmail,
    getUserById
};