const userService = require('./userService');
const jwtService = require('./jwtService');
const env = require('../config/env');
const crypto =  require('crypto');
const argon2 = require('argon2');
const { HttpException } = require('../utils/httpExceptions');
const sendMail = require('./emailService');


const login = async (data) =>
{
    const {email , password} = data;
    const user =  await userService.getUserByEmail(email);
    if (!user || !(await argon2.verify(user.passwordHash, password)))
        throw new HttpException(400, "Wrong credentials");
    if (!user.isVerified) 
        throw new HttpException(403, "Please verify your email before logging in");
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
    const verificationToken =await jwtService.generateVerificationToken(user.id,user.email);
    await sendMail({
        from: env.USER_EMAIL,
        to: user.email,
        subject: "Email Verification",
        text: `Please verify your email by clicking:  ${env.BACKEND_URL}api/auth/verify-email/${verificationToken}`
    });
    delete user.passwordHash;
    return user;
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
        const decoded = await jwtService.verifyRefreshToken(refreshToken);
        const user = await userService.getUserById(decoded.id);
        if(user && user.refreshToken === refreshToken)
        {
            await userService.updateUser(user.id, { refreshToken: null});
        }
    }
    catch(error)
    {

    }
}

const verifyEmail = async(token) =>
{
    const decoded = await jwtService.verifyVerificationToken(token);
    const user = await userService.getUserById(decoded.id);
    if (!user)
        throw new HttpException(404,"user not found");
    if (decoded.email !== user.email)
        throw new HttpException(400, "email mismatch");
    if (user.isVerified)
         throw new HttpException(400, "email already verified");
    await userService.updateUser(user.id, {isVerified : true});
    delete user.passwordHash;
    return user;
}
const resendVerification = async (email) =>
{
    const user = await userService.getUserByEmail(email);
    if (!user)
        throw new HttpException(404, "user with this email not found");
    if (user.isVerified)
        throw new HttpException(400,"email already verified");
    const verificationToken = await jwtService.generateVerificationToken(user.id, email);
    const subject = "verification email";
    const message = `${env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`;
    await sendMail({
        from : env.USER_EMAIL,
        to : user.email,
        subject,
        text: message
    });
    return { message: 'Verification email sent' };
}


module.exports = {
    login,
    register,
    refresh,
    logout,
    verifyEmail,
    resendVerification
}
