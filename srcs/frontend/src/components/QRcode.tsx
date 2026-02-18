import { ArrowRightToLine, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { OtpCode } from './OtpCode';
import { useNavigate } from 'react-router-dom';
type AuthStep = 'QR_CODE' | 'VERIFY_OTP';

export function QRcode() {
    const [step, setStep] = useState<AuthStep>('QR_CODE');
    const [qrLink, setQrLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
    const navigate = useNavigate();
    
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchNewQr = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/2fa/setup/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: user.id }),
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

    useEffect(() => {
        fetchNewQr();
    }, [user?.id]);

    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("Are you sure? This will invalidate the previous QR code.")) {
            fetchNewQr();
        }
    };

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
        try {
            const res = await fetch(`${BACKEND_URL}/api/2fa/verify-setup/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: finalOtp, id: user?.id }),
            });

            if (res.ok) {
                console.log("2FA Verified Successfully!");
                const destination = user?.hasProfile ? "/Dashboard" : "/Createprofile";
                navigate(destination, { replace: true });
            } else {
                alert("Invalid Code. Please try again.");
            }
        } catch (err) {
            console.error("Verification error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 py-10 flex flex-col items-center justify-center m-auto maincard">
            <div className="flex flex-col gap-4 md:gap-8 items-center max-w-sm">
                
                <div className="flex flex-col gap-1 items-center text-center">
                    <h1 className="font-bold text-black text-lg md:text-xl">
                        {step === 'QR_CODE' ? "Scan QR Code" : "Verify Code"}
                    </h1>
                    <p className="font-light text-black text-xs md:text-sm">
                        {step === 'QR_CODE' 
                            ? "Scan this image with your Authenticator App to begin setup." 
                            : "Enter the 6-digit code from your app."}
                    </p>
                </div>

                {step === 'QR_CODE' ? (
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
                        {step === 'VERIFY_OTP' && (
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
                            <span onClick={handleReset} className="font-bold underline cursor-pointer">
                                Reset 2FA
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}