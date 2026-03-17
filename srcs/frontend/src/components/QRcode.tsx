import Icon  from '@/components/ui/Icon'
import { useState, KeyboardEvent, useEffect } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { OtpCode } from './OtpCode';
import { Logout } from '@/components/LogOut';
import { useNavigate } from 'react-router-dom';
import { ProfileChecker } from '@/components/ProfileChecker'
import { mainApi } from '@/utils/Api';
type AuthStep = 'QR_CODE' | 'VERIFY_OTP';

export function QRcode() {
    const [step, setStep] = useState<AuthStep>('QR_CODE');
    const [qrLink, setQrLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
    const navigate = useNavigate();
    const userId = useAuthStore(state => state.userId);
    const setProfile = useAuthStore(state => state.setProfile);
    const setQrVerified = useAuthStore(state => state.setQrVerified);
    const firstLogin = useAuthStore(state => state.firstLogin);
    const setUser = useAuthStore(state => state.setUser);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const fetchNewQr = async () => {
        if (!userId) 
            return;
        setLoading(true);
        try {
            const res = await mainApi.post(`${env_main_api}/2fa/setup/`, { id: userId });
            const result = res.data;
            setQrLink(result.qrDataUrl);
            setStep('QR_CODE');
        } catch (error) {
            console.log("Failed to fetch QR:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (firstLogin)
            fetchNewQr();
        else
            setStep('VERIFY_OTP');
    }, [userId]);

    const handleKeyEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        handleSubmit(); 
    }
};
    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("Are you sure? This will invalidate the previous QR code.")) {
            fetchNewQr();
        }
    };

    const verify = async (method:string, route:string, finalOtp:string) =>{
        const obj = method === "verify-setup" 
            ? { code: finalOtp, id: userId }
            : { code: finalOtp };

        try {
            const res = await mainApi.post(`/${route}`, obj);

            if (!res) {
                setQrVerified(false);
                setOtpArray(new Array(6).fill(""));
                alert("Invalid Code. Please try again.");
                return;
            }
        
            console.log("Verified Successfully!");
            console.log("res :", res);
            const { data } = res.data;

            console.log("user data = ", data);
        
            if (data) {
                setUser(data);
                setQrVerified(true);
                const currentUser = data; 
                console.log("currentUser = ", currentUser.role);
                if (currentUser.role === 'recruiter' || currentUser.role === 'admin') {
                    navigate('/Dashboard', { replace: true });
                }else{
                    const hasProfile = await ProfileChecker({ userId, setProfile });
                    console.log("hasProfile: ", hasProfile);
                    const targetPath = hasProfile ? '/Jobs' : "/Createprofile";
                    navigate(targetPath, { replace: true });
                }
            }
        } catch (error) {
            console.log("Verification failed:", error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }
   
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) 
            e.preventDefault();
        if (step === 'QR_CODE') {
            setStep('VERIFY_OTP');
            return;
        }
        const finalOtp = otpArray.join("");
        if (finalOtp.length < 6) {
            alert("Please enter all 6 digits");
            return;
        }
        setLoading(true);
        if (firstLogin)
            await verify("verify-setup", "api/main/2fa/verify-setup/", finalOtp);
        else
            await verify("verify-2fa", "api/main/auth/verify-2fa/", finalOtp);
        setOtpArray(new Array(6).fill(""));
    };

    return (
        <div className="p-4 py-10 flex flex-col items-center justify-center m-auto
            bg-surface-main dark:bg-[#242c3e] rounded-2xl transition-colors duration-300">
            <div className="flex flex-col gap-4 md:gap-8 items-center max-w-sm">
                {/* Header Text */}
                <div className="flex flex-col gap-1 items-center text-center">
                    <h1 className="font-bold text-black dark:text-surface-main text-lg md:text-xl">
                        {firstLogin && step === 'QR_CODE' ? "Scan QR Code" : "Verify Code"}
                    </h1>
                    <p className="font-light text-black dark:text-gray-400 text-xs md:text-sm">
                        {firstLogin && step === 'QR_CODE' 
                            ? "Scan this image with your Authenticator App to begin setup." 
                            : "Enter the 6-digit code from your app."}
                    </p>
                </div>

                {/* QR Code Section */}
                {firstLogin && step === 'QR_CODE' ? (
                    <div className='relative flex items-center justify-center p-2 border-2 border-dashed 
                        border-gray-200 dark:border-gray-700 rounded-lg bg-surface-main'>
                        {qrLink ? (
                            <img src={qrLink} alt="2FA QR Code" className='h-40 w-40' />
                        ) : (
                            <div className="h-40 w-40 flex items-center justify-center 
                                bg-gray-100 dark:bg-slate-800 animate-pulse">
                                <p className="text-xs text-gray-400">Generating...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <OtpCode otp={otpArray} setOtp={setOtpArray} onKeyEnter={handleKeyEnter} />
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="group flex gap-2 justify-center items-center w-full h-12 
                            bg-primary hover:bg-[#008dbf] rounded-lg font-extrabold 
                            text-surface-main transition-colors shadow-lg shadow-primary/20"
                    >
                        <span>{loading ? "Verifying..." : step === 'QR_CODE' ? "Next" : "Verify"}</span>
                        <Icon name='ArrowRightToLine' className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        {firstLogin && step === 'VERIFY_OTP' && (
                            <button 
                                type="button" 
                                onClick={() => setStep('QR_CODE')}
                                className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400 
                                    hover:text-black dark:hover:text-surface-main transition-colors"
                            >
                                <Icon name='ChevronLeft' className="w-4 h-4"/> Back to QR
                            </button>
                        )}

                        <p className="font-light text-black dark:text-gray-400 text-sm">
                            Need help?{" "}
                            {firstLogin
                                ?
                                <span onClick={handleReset} className="font-bold underline cursor-pointer text-black dark:text-surface-main">
                                    Reset 2FA    
                                </span> 
                                : <span className="font-bold underline cursor-pointer text-black dark:text-surface-main">
                                    Contact support 
                                </span> 
                            }
                        </p>
                    </div>
                </form>
                        
                <div className='items-center'>
                    <Logout />
                </div>
            </div>
        </div>
    );
}