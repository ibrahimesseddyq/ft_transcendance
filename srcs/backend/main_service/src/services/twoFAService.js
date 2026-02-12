import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { success } from "zod";


export class TwoFAService
{
    constructor(userRepo)
    {
        this.userRepo = userRepo;
    }

    async setup(userId)
    {
        const user = await this.userRepo.get2FASecrets(userId);
        if (!user) throw new Error("User Not Found");
        const secret = speakeasy.generateSecret({
            name: `MyApp (${user.email})`,
        });

        await this.userRepo.setTemp2FASecret(userId, secret.base32);
        const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
        return { qrDataUrl, manualKey: secret.base32};
    }

    async verifySetup(userId, token)
    {
        const user = await this.userRepo.get2FASecrets(userId);
        if (!user?.TwoFATempSecret) throw new Error("No Setup in Progress");

        const ok = speakeasy.totp.verify(
            {
                secret: user.TwoFATempSecret,
                encoding: "base32",
                token, 
                window: 1
            }
        );
        if (!ok) throw new Error("Invalid 2FA CODE");

        await this.userRepo.enable2FA(userId, user.TwoFATempSecret);
        return { success: true};
    }
    // trow HTTP Exceptions
    async verifyLogin(userId, token)
    {
        const user = await this.userRepo.get2FASecrets(userId);

        if (!user?.twoFAEnabled || !user.twoFASecret) throw new Error("2FA NOT ENABLED");

        const ok = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: "base32",
            token,
            window: 1
        });
        if (!ok) throw new Error("Invalid 2FA Code");
        return true;
    }

    async disable(userId, token)
    {
        await this.verifyLogin(userId, token);
        await this.userRepo.disable2FA(userId);
        return { success: true};
    }
};