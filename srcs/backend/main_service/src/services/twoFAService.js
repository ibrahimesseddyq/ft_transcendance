import speakeasy from "speakeasy";
import QRCode from "qrcode";


 class TwoFAService
{
    constructor(userRepo)
    {
        this.userRepo = userRepo;
    }

    async setup(userId)
    {
        const user = await this.userRepo.getUserById(userId);
        if (!user) throw new Error("User Not Found");
        const secret = speakeasy.generateSecret({
            name: `MyApp (${user.email})`,
        });

        await this.userRepo.updateUser(userId, { twoFATempSecret: secret.base32});
        const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
        return { qrDataUrl, manualKey: secret.base32};
    }

    async verifySetup(userId, token)
    {
        const user = await this.userRepo.getUserById(userId);
        if (!user?.twoFATempSecret) throw new Error("No Setup in Progress");

        const ok = speakeasy.totp.verify(
            {
                secret: user.twoFATempSecret,
                encoding: "base32",
                token, 
                window: 1
            }
        );
        if (!ok) throw new Error("Invalid 2FA CODE");
        // enable 2fa
        await this.userRepo.updateUser(userId,{
            twoFAEnabled: true,
            twoFASecret: user.twoFATempSecret,
            twoFATempSecret: null
        });
        return { success: true};
    }
    // trow HTTP Exceptions
    async verifyLogin(userId, token)
    {
        const user = await this.userRepo.getUserById(userId);

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
        await this.userRepo.updateUser(userId,{
            twoFAEnabled: false,
            twoFASecret:null,
            twoFATempSecret:null
        });
        return { success: true};
    }
};
export default  TwoFAService;