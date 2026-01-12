const env = require('../config/env');
const {UserRole} = require('../../generated/prisma');
const userService = require('./userService');
const jwtService = require('./jwtService');
const argon2 = require('argon2');
const { HttpException } = require('../utils/httpExceptions');
const { email } = require('zod');


const login = async (data) =>
{
    const {email , password} = data;
    const user =  await userService.getUserByEmail(email);
    if (!user || !(await argon2.verify(user.passwordHash, password)))
        throw new HttpException(400, "Wrong credentials");
    const tokens = jwtService.generateAuthTokens({
        id : user.id,
        email: user.email,
        role: user.role
    });
    await userService.updateUser(user.id,{refreshToken :tokens.refreshToken});
    delete user.passwordHash;
    return {
        user,
        ...tokens
    }
}

const  register = async (data) =>
{
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser)
        throw new HttpException(409, 'Email already exists');
    const user = await userService.createUser(data);
    const tokens = jwtService.generateAuthTokens({
        id : user.id,
        email : user.email,
        role: user.role
    })
    await userService.updateUser(user.id,{refreshToken : tokens.refreshToken});
    delete user.passwordHash;
    return {
        user,
        ...tokens
    }
}

const refresh = async  (refreshToken) =>
{
    const decoded = await jwtService.verifyRefreshToken(refreshToken);
    const user = await  userService.getUserById(decoded.id);
    if(!user)
        throw new HttpException(403, "Forbidden");
    if (user.refreshToken !== refreshToken)
        throw new HttpException(403, "Forbidden");
    const {accessToken} = jwtService.generateAuthTokens({
        id : user.id,
        email : user.email,
        role: user.role
    });
    delete user.passwordHash;
    delete user.refreshToken;
    return {
        user,
        accessToken,
        refreshToken
    }
}

const logout = async (refreshToken) =>
{
    try
    {
        const decoded = jwtService.verifyRefreshToken(refreshToken);
        const user = userService.getUserById(decoded.id);
        if(user && user.refreshToken === refreshToken)
        {
            await userService.update(user.id, { refreshToken: null});
        }
    }
    catch(error)
    {

    }
}

module.exports = {
    login,
    register,
    refresh,
    logout
}
