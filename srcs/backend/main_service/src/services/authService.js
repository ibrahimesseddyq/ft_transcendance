import * as userService from './userService.js';
import * as  jwtService from './jwtService.js';
import env from '../config/env.js';
import argon2 from 'argon2';
import { HttpException } from '../utils/httpExceptions.js';
import sendMail from './emailService.js';
import twoFAService from './twoFAService.js';
const DUMMY_HASH = process.env.DUMMY_PASSWORD_HASH;
const twoFAService2 = new twoFAService();

export const login = async (data) =>
    {
    const { email, password } = data;
  
    const user = await userService.getUserByEmail(email);
        
    console.log("current user : ", user);
    // Always verify: real hash if user exists, dummy hash otherwise
    const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
  
    let passwordOk = false;
    try
    {
      passwordOk = await argon2.verify(hashToCheck, password);
    }
    catch
    {
      // If hash format is bad, treat as failure (don’t branch differently)
      passwordOk = false;
    }
  
    // Keep errors uniform for auth failure
    if (!user || !passwordOk) {
      throw new HttpException(400, "Wrong credentials or user doesnt exist");
    }
  
    // Consider making this message generic too if you want to avoid
    // "verified account enumeration"
    if (!user.isVerified) {
      // Safer: same as wrong credentials (or same status/message)
      throw new HttpException(400, "User is not verified");
      // Alternative: still block but generic
      // throw new HttpException(400, "Wrong credentials");
    }
  
    if (user.twoFAEnabled )
    {
        const tempToken = jwtService.generateTempToken({
            id: user.id,
            email: user.email,
            purpose: '2fa-pending'
        });

        return {
            require2FA: true,
            tempToken,
            firstLogin: user.firstLogin,
            userId: user.id
        };
    }

    const tokens = jwtService.generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  
    await userService.updateUser(user.id, { refreshToken: tokens.refreshToken });
  
    const { passwordHash, ...safeUser } = user;
    return { user: safeUser, ...tokens, userId: user.id};
  };

export const verifyLoginWith2FA = async (tempToken, twoFACode) => {
    const decoded = await jwtService.verifyTempToken(tempToken);

    if (decoded.purpose !== '2fa-pending')
    {
        throw new HttpException(403, "Invalid Token");
    }

    const user = await userService.getUserById(decoded.id);

    if (!user || !user.twoFAEnabled) 
    {
        throw new HttpException(403, "Invalid request");
    }


    const isValid = await twoFAService2.verifyLogin(user.id, twoFACode);

    if (!isValid)
    {
        throw new HttpException(400, "Invalid 2FA Code");
    }

    const tokens = jwtService.generateAuthTokens(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        }
    );
    await userService.updateUser(user.id, { refreshToken: tokens.refreshToken});
    console.log(user);
    console.log("")

    console.log(user)
    delete user.twoFASecret;
    delete user.twoFATempSecret;
    const { passwordHash, ...saferUser} = user;
    return { user: saferUser, ...tokens};
}
export const  register = async (data) => {
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser){
        console.log("user exist");
        return {};
    }
    const user = await userService.createUser(data);
    const verificationToken =await jwtService.generateVerificationToken(user.id,user.email);
    await sendMail({
        from: env.USER_EMAIL,
        to: user.email,
        subject: "Email Verification",
        text: `Please verify your email by clicking:  ${env.BACKEND_URL}api/auth/verify-email/${verificationToken}`
    });
    delete user.passwordHash;
    return {};
}

export const refresh = async  (refreshToken) => {
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

export const logout = async (refreshToken) => {
    try {
        const decoded = await jwtService.verifyRefreshToken(refreshToken);
        const user = await userService.getUserById(decoded.id);
        if(user && user.refreshToken === refreshToken)
        {
            await userService.updateUser(user.id, { refreshToken: null});
        }
    }
    catch(error){

    }
}

export const verifyEmail = async(token) => {
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
export const resendVerification = async (email) => {
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
