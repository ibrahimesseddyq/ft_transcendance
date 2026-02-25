import { ArrowRightToLine, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { OtpCode } from './OtpCode';
import { Logout } from '@/components/LogOut';
import { useNavigate } from 'react-router-dom';
import { ProfileChecker } from '@/components/ProfileChecker'
import { SetToken } from '@/components/SetToken'
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
type AuthStep = 'QR_CODE' | 'VERIFY_OTP';

export function QRcode() {
    const [step, setStep] = useState<AuthStep>('QR_CODE');
    const [qrLink, setQrLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const userId = useAuthStore((state) => state.userId);
    const firstLogin = useAuthStore((state) => state.firstLogin);
    const setQrVerified = useAuthStore((state) => state.setQrVerified);
    const setProfile = useAuthStore((state) => state.setProfile);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const token = Cookies.get('accessToken');

    // console.log("User id : ", userId);

    const fetchNewQr = async () => {
        if (!userId) 
            return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/2fa/setup/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId }),
                credentials: 'include'
            });
            if (res.ok) {
                const result = await res.json();
                setQrLink(result.qrDataUrl);
                setStep('QR_CODE');
            }
        } catch (error) {
            console.error("Failed to fetch QR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (firstLogin){
        useEffect(() => {
            fetchNewQr();
        }, [userId]);
    }

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
        console.log('token is:', token)
        try {
            const res = await fetch(`${BACKEND_URL}/${route}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            });
            if (res.ok) {
                console.log("Verified Successfully!");
                const newUser = await res.json();
                if (newUser.data){
                    // console.log("user data", newUser);
                    setUser(newUser.data.user);
                    SetToken(newUser.data.accessToken);
                    const check = await ProfileChecker({userId, setProfile});
                    if (!check)
                        navigate("/Createprofile", { replace: true });
                    else
                        navigate("/", { replace: true });
                }
                setQrVerified(true);
            } else {
                setQrVerified(false);
                setOtpArray(new Array(6).fill(""));
                alert("Invalid Code. Please try again.");
            }
        } catch (err) {
            console.error("Verification error:", err);
        } finally {
            setLoading(false);
        }
    }
   
    const handleSubmit = async (e: React.FormEvent) => {
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
            await verify("verify-setup", "api/2fa/verify-setup/", finalOtp);
        else
            await verify("verify-2fa", "api/auth/verify-2fa/", finalOtp);
    };

    return (
        <div className="p-4 py-10 flex flex-col items-center justify-center m-auto maincard">
            <div className="flex flex-col gap-4 md:gap-8 items-center max-w-sm">
                
                <div className="flex flex-col gap-1 items-center text-center">
                    <h1 className="font-bold text-black text-lg md:text-xl">
                        {firstLogin && step === 'QR_CODE' ? "Scan QR Code" : "Verify Code"}
                    </h1>
                    <p className="font-light text-black text-xs md:text-sm">
                        {firstLogin && step === 'QR_CODE' 
                            ? "Scan this image with your Authenticator App to begin setup." 
                            : "Enter the 6-digit code from your app."}
                    </p>
                </div>

                {firstLogin && step === 'QR_CODE' ? (
                    <div className='relative flex items-center justify-center p-2 border-2 border-dashed border-gray-200 rounded-lg'>
                        {qrLink ? (
                            <img src={qrLink} alt="2FA QR Code" className='h-40 w-40' />
                        ) : (
                            <div className="h-40 w-40 flex items-center justify-center bg-gray-100 animate-pulse">
                                <p className="text-xs text-gray-400">Generating...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <OtpCode otp={otpArray} setOtp={setOtpArray} />
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="group flex gap-2 justify-center items-center w-full h-12 bg-[#00adef] hover:bg-[#008dbf] rounded-lg font-extrabold text-white transition-colors"
                    >
                        <span>{loading ? "Verifying..." : step === 'QR_CODE' ? "Next" : "Verify"}</span>
                        <ArrowRightToLine className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        {firstLogin && step === 'VERIFY_OTP' && (
                            <button 
                                type="button" 
                                onClick={() => setStep('QR_CODE')}
                                className="text-sm flex items-center gap-1 text-gray-500 hover:text-black"
                            >
                                <ChevronLeft className="w-4 h-4"/> Back to QR
                            </button>
                        )}
                        <p className="font-light text-black text-sm">
                            Need help?
                            {firstLogin
                                ?
                                <span onClick={handleReset} className="font-bold underline cursor-pointer">
                                    Reset 2FA    
                                </span> 
                                : <span className="font-bold underline cursor-pointer">
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