import Icon  from '@/components/ui/Icon'
import { useState, KeyboardEvent, useEffect } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { OtpCode } from './OtpCode';
import { Logout } from '@/components/LogOut';
import { useNavigate } from 'react-router-dom';
import { ProfileChecker } from '@/components/ProfileChecker'
import { mainService } from '@/utils/Api';
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
            const res = await mainService.post(`${env_main_api}/2fa/setup/`, { id: userId });
            const result = res.data;
            setQrLink(result.qrDataUrl);
            setStep('QR_CODE');
        } catch (error) {

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
            const res = await mainService.post(`${route}`, obj);

            if (!res) {
                setQrVerified(false);
                setOtpArray(new Array(6).fill(""));
                alert("Invalid Code. Please try again.");
                return;
            }
        
            const { data } = res.data;
        
            if (data) {
                setUser(data);
                setQrVerified(true);
                const currentUser = data; 
                if (currentUser.role === 'recruiter' || currentUser.role === 'admin') {
                    navigate('/Dashboard', { replace: true });
                }else{
                    const hasProfile = await ProfileChecker({ userId, setProfile });
                    const targetPath = hasProfile ? '/Jobs' : "/Createprofile";
                    navigate(targetPath, { replace: true });
                }
            }
        } catch (error) {
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
            await verify("verify-setup", `${env_main_api}/2fa/verify-setup/`, finalOtp);
        else
            await verify("verify-2fa", `${env_main_api}/auth/verify-2fa/`, finalOtp);
        setOtpArray(new Array(6).fill(""));
    };

    const isQrStep = firstLogin && step === 'QR_CODE';

    return (
        <section className="w-full px-4 py-8 md:py-10">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_18px_60px_-30px_rgba(2,132,199,0.45)] transition-colors duration-300 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sky-200/40 blur-2xl dark:bg-sky-500/20" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-cyan-200/40 blur-2xl dark:bg-cyan-500/20" />

                <div className="relative flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200">
                        <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
                        Two-Factor Authentication
                    </div>

                    <div className="flex w-full items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">
                        <span className={`rounded-full px-3 py-1 ${isQrStep ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'}`}>
                            Scan
                        </span>
                        <div className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
                        <span className={`rounded-full px-3 py-1 ${!isQrStep ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'}`}>
                            Verify
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            {isQrStep ? "Scan QR Code" : "Verify Security Code"}
                        </h1>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {isQrStep
                                ? "Open your authenticator app and scan this QR code to connect your account securely."
                                : "Enter the 6-digit code from your authenticator app to complete sign in."}
                        </p>
                    </div>

                    {isQrStep ? (
                        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800">
                                {qrLink ? (
                                    <img src={qrLink} alt="2FA QR Code" className="h-44 w-44 rounded-md" />
                                ) : (
                                    <div className="flex h-44 w-44 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700 animate-pulse">
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-300">Generating secure QR...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <OtpCode otp={otpArray} setOtp={setOtpArray} onKeyEnter={handleKeyEnter} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008dbf] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span>{loading ? "Verifying..." : isQrStep ? "Continue" : "Verify & Login"}</span>
                            <Icon name="ArrowRightToLine" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <div className="flex flex-col items-center gap-2 text-sm">
                            {firstLogin && step === 'VERIFY_OTP' && (
                                <button
                                    type="button"
                                    onClick={() => setStep('QR_CODE')}
                                    className="inline-flex items-center gap-1 font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                                >
                                    <Icon name="ChevronLeft" className="h-4 w-4" /> Back to QR
                                </button>
                            )}

                            <p className="text-slate-500 dark:text-slate-300">
                                Need help?{" "}
                                {firstLogin ? (
                                    <button type="button" onClick={handleReset} className="font-semibold text-slate-800 underline underline-offset-2 transition-colors hover:text-primary dark:text-slate-100">
                                        Reset 2FA
                                    </button>
                                ) : (
                                    <span className="font-semibold text-slate-800 underline underline-offset-2 dark:text-slate-100">
                                        Contact support
                                    </span>
                                )}
                            </p>
                        </div>
                    </form>

                    <div className="pt-1">
                        <Logout />
                    </div>
                </div>
            </div>
        </section>
    );
}