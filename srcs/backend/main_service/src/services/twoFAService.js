import speakeasy from "speakeasy";
import QRCode from "qrcode";
import {HttpException} from '../utils/httpExceptions.js';
import * as userRepository from '../repositories/userRepository.js';
import * as userService from './userService.js';
import * as  jwtService from './jwtService.js';
import { getSafeUser } from "../utils/excludeSensitive.js";


 class TwoFAService
{
    constructor() {
        this.userRepo = userRepository;
    }

    async setup(userId)
    {
        const user = await this.userRepo.getUserById(userId);
        if (!user)
            throw new HttpException(400, "User Not Found");
        const secret = speakeasy.generateSecret({
            name: `MyApp (${user.email})`,
        });

        await this.userRepo.updateUser(userId, { twoFATempSecret: secret.base32});
        const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
        return { qrDataUrl, manualKey: secret.base32};
    }

    async verifySetup(userId, token) {
        const user = await this.userRepo.getUserById(userId);
        if (!user?.twoFATempSecret)
            throw new HttpException(400, "No Setup in Progress");

        const ok = speakeasy.totp.verify({
            secret: user.twoFATempSecret,
            encoding: "base32",
            token,
            window: 1
        });
        if (!ok) throw new HttpException(400, "Invalid 2FA CODE");

        await this.userRepo.updateUser(userId, {
            twoFAEnabled: true,
            twoFASecret: user.twoFATempSecret,
            twoFATempSecret: null
        });

        const tokens = jwtService.generateAuthTokens({
            id: user.id, email: user.email, role: user.role,
        });

        if (user.firstLogin === true) {
            await userService.updateUser(user.id, { firstLogin: false });
            user.firstLogin = false;
        }

        return {
            success: true,
            user: getSafeUser(user),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }
    // trow HTTP Exceptions
    async verifyLogin(userId, token)
    {
        const user = await this.userRepo.getUserById(userId);

        if (!user?.twoFAEnabled || !user.twoFASecret) throw new HttpException(400, "2FA NOT ENABLED");

        const ok = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: "base32",
            token,
            window: 1
        });
        console.log('token : ', token)
        if (!ok) throw new HttpException(400, "Invalid 2FA Code");
        return true;
    }

    async disable(userId, token)
    {
        await this.verifyLogin(userId, token);
        await this.userRepo.updateUser(userId,{
            twoFAEnabled: false,
            twoFASecret:null,
            twoFATempSecret:null
        });
        return { success: true};
    }
};
export default TwoFAService;