import { useForm } from "react-hook-form";
import { z } from "zod";
import { CloudUpload, SquarePen } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfileSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";
import { useAuthStore } from '@/utils/ZuStand';
import { Logout } from '@/components/LogOut';
import { useState } from "react";

type ProfileFormData = z.infer<typeof CandidateProfileSchema>;

interface FormFieldProps {
  label?: string;
  name: keyof ProfileFormData;
  register: any;
  error?: string;
  placeholder?: string;
  type?: string;
  optional: boolean;
}

const FormField = ({ label, name, register, error, placeholder, type, optional }: FormFieldProps) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 group">
    <label htmlFor={name} className="w-full md:w-40 text-sm font-medium text-gray-400 
      group-focus-within:text-[#00adef] transition-colors">
      {label}
    </label>
    <div className="flex-1 relative">
      {optional ? null : <h1 className="absolute top-0 right-1 text-red-600">*</h1> }
      <input
        id={name}
        type={type}
        {...register(name, { valueAsNumber: type === "number" })}
        placeholder={placeholder}
        className="h-11 w-full text-sm text-black outline-none px-3 border-b border-gray-800 bg-transparent focus:border-[#00adef] transition-all placeholder:text-gray-600"
      />
      {error && <p className="mt-1 text-red-400 text-[10px] italic">{error}</p>}
    </div>
  </div>
);

export function ProfileInformations() {
  const userId = useAuthStore((state) => (state.user?.id));
  const setProfile = useAuthStore((state)=> state.setProfile);
  const [avatarPreview, setAvatarPreview] = useState("/icons/placeholder.jpg");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(CandidateProfileSchema),
    defaultValues: {
      userId: userId,
    }
  });


  
  const onApplySubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("linkedinUrl", data.linkedinUrl);
    formData.append("currentTitle", data.currentTitle);
    formData.append("skills", data.skills);
    if (data.portfolioUrl) 
      formData.append("portfolioUrl", data.portfolioUrl);
    if (data.currentCompany)
      formData.append("currentCompany", data.currentCompany);
    if (data.avatar)
      formData.append("avatar", data.avatar);
    if (data.resume)
      formData.append("resume", data.resume);
    try {
        const response = await fetch(`${BACKEND_URL}/api/profiles`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          setProfile(result.data || result);
          Notification("Profile created successfully!", "success");
        } else if (response.status === 400 && result.errors === 'profile already exists') {
          setProfile(result.data || result); 
        }
    } catch (error) {
        console.error("Submission failed:", error);
        Notification("Technical error occurred", "error");
    }finally{
      
    }
      reset();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      if (newUrl) {
        setAvatarPreview(newUrl);
        setValue("avatar", file, { shouldValidate: true });
      }
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit(onApplySubmit)}
      className="w-full max-w-screen-2xl mx-auto flex flex-col gap-8 p-4 md:p-10 bg-transparent overflow-auto"
    >
      {/* Header Section */}
      <header className="border-b border-gray-300 pb-6 w-full">
        <h1 className="text-black text-3xl font-bold">Profile Setup</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your professional presence and job preferences.</p>
      </header>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-2">
        <div 
          className={`relative h-32 w-32 rounded-full bg-[#1e1e1e] bg-cover bg-center border-4 shadow-lg
              ${errors.avatar ? 'border-red-500' : 'border-[#00adef]'}`}
          style={{ backgroundImage: `url(${avatarPreview})` }}
        >
          <input 
            id="avatar"
            type='file'
            accept="image/*"
            {...register("avatar")} 
            onChange={handleImageChange}
            className="hidden"
          />
          <label htmlFor="avatar" className="absolute inset-0 cursor-pointer flex items-center justify-center rounded-full hover:bg-black/20 transition-all">
            <SquarePen className="absolute top-0 right-0 h-8 w-8 p-1.5 bg-white rounded-full shadow-md text-[#00adef] hover:scale-110 transition-transform" />
          </label>
        </div>
        {errors.avatar && <p className="text-red-500 text-xs italic">{errors.avatar.message}</p>}
      </div>
          
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full items-start">
          
        {/* Professional Info */}
        <section className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-[#00adef] text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#00adef] rounded-full" />
            Professional Information
          </h2>
          
          <div className="flex flex-col gap-5">
            <FormField label="LinkedIn URL" name="linkedinUrl" optional={false} register={register} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
            <FormField label="Portfolio URL" name="portfolioUrl" optional={true} register={register} error={errors.portfolioUrl?.message} placeholder="https://yourwork.com" />
            <FormField label="Current Company" name="currentCompany" optional={true} register={register} error={errors.currentCompany?.message} placeholder="Company Name" />
            <FormField label="Current Job Title" name="currentTitle" optional={false} register={register} error={errors.currentTitle?.message} placeholder="Ex: Software Engineer" />
            <FormField label="Years of Experience" name="yearsExperience" type="number" optional={true} register={register} error={errors.yearsExperience?.message} placeholder="5" />
            <FormField label="Skills" name="skills" optional={true} register={register} error={errors.skills?.message} placeholder="Ex: React, Node.js, TypeScript..." />
          </div>
        </section>
          
        {/* Preferences & Resume */}
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-[#00adef] text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00adef] rounded-full" />
              Job Preferences
            </h2>

            <div className="flex flex-col gap-5">
              <FormField label="Preferred Locations" name="preferredLocations" optional={true} register={register} error={errors.preferredLocations?.message} placeholder="Remote, New York, London" />
              <FormField label="Salary Expectation" name="salaryExpectation" optional={true} register={register} error={errors.salaryExpectation?.message} placeholder="e.g. $120k - $150k" />
            </div>
          </section>
          
          {/* Resume Upload */}
          <section className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-gray-700 text-sm font-bold uppercase tracking-wider">Resume / CV</h2>
            <label 
              className={`group flex flex-col items-center justify-center w-full py-8 cursor-pointer
                border-2 border-dashed rounded-xl bg-gray-50 
                transition-all duration-300
                ${errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00adef] hover:bg-[#00adef]/5'}`}>
                
              <CloudUpload className={`h-12 w-12 mb-3 transition-colors ${errors.resume ? 'text-red-500' : 'text-gray-400 group-hover:text-[#00adef]'}`} />
              <div className="text-center">
                <h1 className="text-sm font-semibold text-gray-700">Click to upload Resume</h1>
                <p className="text-xs text-gray-500 mt-1">PDF format (Max 5MB)</p>
              </div>
              <input id="cv-upload" type="file" accept="application/pdf" {...register("resume")} hidden />
            </label>
            {errors.resume && <p className="text-red-500 text-xs italic text-center">{errors.resume.message}</p>}
          </section>
        </div>
      </div>
              
      <footer className="mt-4 flex flex-col md:flex-row gap-4 justify-center md:justify-end pb-10">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-64 bg-[#00adef] hover:bg-[#0086b8] text-white font-bold py-4 px-8 
            rounded-2xl transition-all shadow-xl shadow-[#00adef]/30 items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Saving Profile...
            </>
          ) : "Complete Setup"}
        </button>
        <Logout className="text-gray-400 hover:text-red-500 text-sm font-semibold transition-all" />
      </footer>
    </form>
  );
}