import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Icon  from '@/components/ui/Icon'
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfileSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";
import { useAuthStore } from '@/utils/ZuStand';
import { Logout } from '@/components/LogOut';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mainService } from '@/utils/Api';

type ProfileFormData = z.infer<typeof CandidateProfileSchema>;

const InternalProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
    <div 
      className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" 
      style={{ width: `${progress}%` }}
    />
  </div>
);

interface FormFieldProps {
  label?: string;
  name: keyof ProfileFormData;
  register: any;
  error?: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  optional: boolean;
}

const FormField = ({ label, name, register, maxLength, error, placeholder, type, optional }: FormFieldProps) => (
  <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-6 group">
    <label htmlFor={name} className="w-full xl:w-44 text-sm font-medium text-slate-500 dark:text-slate-400 group-focus-within:text-primary transition-colors">
      {label}
    </label>
    <div className="flex-1 relative">
      {!optional && <h1 className="absolute top-0 right-1 text-red-500">*</h1>}
      <input
        id={name}
        type={type}
        maxLength={maxLength}
        {...register(name, { valueAsNumber: type === "number" })}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg text-sm text-black dark:text-surface-main outline-none px-3 border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 focus:border-primary dark:focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      {error && <p className="mt-1 text-danger-hover text-[10px] italic">{error}</p>}
    </div>
  </div>
);

export function ProfileInformations() {
  const userId = useAuthStore((state) => state.user?.id);
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
  const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;
  
  const initialAvatar = user?.avatarUrl ? `${BACKEND_URL}${user.avatarUrl}` : '/icons/placeholder.jpg';
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [resumeProgress, setResumeProgress] = useState(0);
  
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(CandidateProfileSchema)
  });

  const avatarValue = watch("avatar");
  const resumeValue = watch("resumeUrl");
  const hasAvatar = avatarValue && (avatarValue instanceof FileList ? avatarValue.length > 0 : !!avatarValue);
  const hasResume = resumeValue && (resumeValue instanceof FileList ? resumeValue.length > 0 : !!resumeValue);

  useEffect(() => {
    if (user?.avatarUrl) setAvatarPreview(`${BACKEND_URL}${user.avatarUrl}`);
  }, [user, BACKEND_URL]);

  const startProgressAnimation = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    return new Promise<void>((resolve) => {
      setter(10);
      const interval = setInterval(() => {
        setter((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          const increment = Math.floor(Math.random() * 15) + 5;
          return Math.min(prev + increment, 100);
        });
      }, 150);
    });
  };

  const onApplySubmit = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'avatar' && key !== 'resumeUrl' && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    try {
      if (data.avatar instanceof File) formData.append("avatar", data.avatar);
      if (data.resumeUrl instanceof File) formData.append("resume", data.resumeUrl);

      const apiPromise = mainService.post(`${env_main_api}/profiles/${userId}`, formData);
      
      const animations = [];
      if (data.avatar instanceof File) 
        animations.push(startProgressAnimation(setAvatarProgress));
      if (data.resumeUrl instanceof File)
        animations.push(startProgressAnimation(setResumeProgress));

      const [response] = await Promise.all([apiPromise, ...animations]);

      setProfile(response.data.data);
      Notification("Profile updated successfully!", "success");

      const targetPath = isAdminOrRecruiter ? '/Dashboard' : '/Jobs';
      navigate(targetPath, { replace: true });

    } catch (error) {
      setAvatarProgress(0);
      setResumeProgress(0);
      Notification("Please enter a valid profile", "error");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", file, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onApplySubmit)} className="max-w-screen-2xl p-3 sm:p-5 lg:p-6 overflow-y-auto custom-scrollbar w-full mx-auto rounded-3xl bg-gradient-to-b from-white/40 via-sky-50/40 to-transparent dark:from-slate-900/30 dark:via-slate-900/10 dark:to-transparent">
      <ToastContainer />
      <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
        <header className="border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900 mb-3">
            Candidate Onboarding
          </div>
          <h1 className="text-black dark:text-surface-main text-2xl sm:text-3xl font-bold">Create Your Professional Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Complete your information to unlock personalized jobs and recruiter outreach.</p>
        </header>

      {/* Avatar Section */}
      <div className="relative group mx-auto my-6 sm:my-8 w-28 h-28 sm:w-32 sm:h-32">
        <div 
          className={`h-full w-full rounded-full bg-gray-100 dark:bg-[#1e1e1e] bg-cover bg-center border-2 transition-all duration-300 shadow-md ${
              errors.avatar ? 'border-red-500 bg-red-50/5' : hasAvatar ? 'border-green-500 bg-green-50/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary bg-primary/5'
            }`}
          style={{ backgroundImage: `url("${avatarPreview ?? '/icons/placeholder.jpg'}")`}}
        >
          {isSubmitting && avatarProgress > 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full text-surface-main text-xs font-bold backdrop-blur-[1px]">
                {avatarProgress < 100 ? <Icon name='Loader2' className="animate-spin h-5 w-5 mb-1 text-primary" /> : <span className="text-green-400 text-xl">✓</span>}
                <span className="mt-1">{avatarProgress}%</span>
             </div>
          )}
        </div>
        <input id="avatar-input" type='file' accept="image/*" className="hidden" onChange={handleImageChange} />
        <label htmlFor="avatar-input" className="absolute bottom-1 right-1 p-2 bg-surface-main dark:bg-gray-800 rounded-full shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform">
          <Icon name='SquarePen' className="h-4 w-4" />
        </label>
      </div>

      <div className="px-4 sm:px-6 pb-6 sm:pb-8 grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-10 w-full">
        <section className="flex flex-col gap-5 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 bg-white/70 dark:bg-slate-900/40">
          <h2 className="text-primary text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" /> Professional Information
          </h2>
          <div className="flex flex-col gap-4">
            <FormField label="LinkedIn URL" name="linkedinUrl" type="url" optional={false} register={register} error={errors.linkedinUrl?.message} />
            <FormField label="Portfolio URL" name="portfolioUrl" type="url" optional={true} register={register} error={errors.portfolioUrl?.message} />
            <FormField label="Current Company" name="currentCompany" optional={true} register={register} error={errors.currentCompany?.message} />
            <FormField label="Current Job Title" name="currentTitle" optional={false} register={register} error={errors.currentTitle?.message} />
            <FormField label="Skills" name="skills" optional={true} register={register} error={errors.skills?.message} />
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 bg-white/70 dark:bg-slate-900/40">
          <h2 className="text-primary text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" /> Contact & Resume
          </h2>
          <div className="flex flex-col gap-4 mb-1">
            <FormField label="Available From" name="availableFrom" type='date' optional={true} register={register} error={errors.availableFrom?.message} />
            <FormField label="Phone Number" name="phone" optional={false} register={register} error={errors.phone?.message} />
          </div>

          <div className="w-full mt-1">
            <label className={`flex flex-col items-center justify-center w-full h-32 cursor-pointer border-2 border-dashed rounded-lg transition-all duration-200 ${
              errors.resumeUrl ? 'border-red-500 bg-red-50/5' : hasResume ? 'border-green-500 bg-green-50/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary bg-primary/5'
            }`}>
              <div className="flex flex-col items-center justify-center py-4 w-full px-6 text-center">
                {isSubmitting && resumeProgress > 0 ? (
                  <div className="w-full">
                    <p className="text-xs font-bold text-primary mb-1">
                      {resumeProgress < 100 ? `UPLOADING: ${resumeProgress}%` : "UPLOAD COMPLETE ✓"}
                    </p>
                    <InternalProgressBar progress={resumeProgress} />
                  </div>
                ) : (
                  <>
                    <Icon name='CloudUpload' className={`h-10 w-10 mb-2 ${errors.resumeUrl ? 'text-red-500' : hasResume ? 'text-green-500' : 'text-gray-400'}`} />
                    <h1 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {hasResume ? "Resume Attached" : "Click to upload Resume"}
                    </h1>
                  </>
                )}
              </div>
              <input id="resume-input" type="file" accept="application/pdf" {...register("resumeUrl")} hidden />
            </label>
          </div>
        </section>
      </div>

      <footer className="flex flex-col-reverse sm:flex-row mt-1 px-4 sm:px-6 pb-6 sm:pb-8 gap-2 justify-end">
        {profile ? (
          <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto font-semibold py-3 px-6 text-black dark:text-surface-main hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-xl">
            Cancel
          </button>
        ) : (
          <div className="w-full sm:w-auto">
            <Logout />
          </div>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full md:w-48 bg-primary hover:bg-[#0086b8] disabled:bg-gray-400 text-surface-main font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><Icon name='Loader2' className="animate-spin h-4 w-4" /> Saving...</> : "Save Profile"}
        </button>
      </footer>
      </div>
    </form>
  );
}