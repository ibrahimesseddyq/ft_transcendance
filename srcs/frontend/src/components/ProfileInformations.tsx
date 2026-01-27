import { useForm } from "react-hook-form";
import { z } from "zod";
import { CloudUpload } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfileSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";

type ProfileFormData = z.infer<typeof CandidateProfileSchema>;

interface FormFieldProps {
  label?: string;
  name: keyof ProfileFormData;
  register: any;
  error?: string;
  placeholder?: string;
  type?: string;
}

const FormField = ({ label, name, register, error, placeholder, type }: FormFieldProps) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 group">
    <label htmlFor={name} className="w-full md:w-40 text-sm font-medium text-gray-400 
      group-focus-within:text-[#10B77F] transition-colors">
      {label}
    </label>
    <div className="flex-1">
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="h-11 w-full text-sm text-white outline-none px-3 border-b border-[#405673] bg-transparent focus:border-[#10B77F] transition-all"
      />
      {error && <p className="mt-1 text-red-400 text-[10px] italic">{error}</p>}
    </div>
  </div>
);

export function ProfileInformations() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(CandidateProfileSchema),
  });

  const onApplySubmit = async (data: ProfileFormData) => {
    try {
      console.log("Form Data:", data);
      Notification("Profile updated successfully!", "success");
      reset();
    } catch (error) {
      Notification("Failed to update profile", "error");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onApplySubmit)}
      className="h-full w-full max-w-screen-2xl mx-auto flex flex-col gap-8 p-6 overflow-y-auto custom-scrollbar">
      <header className="border-b border-[#405673] pb-4">
        <h1 className="text-white text-2xl font-bold">Profile Setup</h1>
        <p className="text-gray-400 text-sm">Manage your professional presence and job preferences.</p>
      </header>

      <div className={`h-20 w-20 rounded-full bg-slate-500 mx-auto
            ${errors.avatar ? 'border-red-500' : 'border-[#405673]'}`}>
        <input type='file' {...register("avatar")} 
          className="h-full w-full" hidden/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Professional Info */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[#10B77F] text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#10B77F] rounded-full" />
            Professional Information
          </h2>
          
          <div className="flex flex-col gap-5 pl-4">
            <FormField label="LinkedIn URL" name="linkedinUrl" 
              register={register} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
            <FormField label="Portfolio URL" name="portfolioUrl" 
              register={register} error={errors.portfolioUrl?.message} placeholder="https://yourwork.com" />
            <FormField label="Current Company" name="currentCompany" 
              register={register} error={errors.currentCompany?.message} placeholder="Company Name" />
            <FormField label="Current Job Title" name="currentTitle" 
              register={register} error={errors.currentTitle?.message} placeholder="Software Engineer" />
            <FormField label="Years of Experience" name="yearsExperience" type="number" 
              register={register} error={errors.yearsExperience?.message} placeholder="5" />
            <FormField label="Skills" name="skills" 
              register={register} error={errors.skills?.message} placeholder="React, Node.js, TypeScript..." />
          </div>
        </section>

        {/* Job Preferences */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[#10B77F] text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#10B77F] rounded-full" />
            Job Preferences
          </h2>
          
          <div className="flex flex-col gap-5 pl-4">
            <FormField label="Preferred Locations" name="preferredLocations" 
              register={register} error={errors.preferredLocations?.message} placeholder="Remote, New York, London" />
            <FormField label="Salary Expectation" name="salaryExpectation" 
              register={register} error={errors.salaryExpectation?.message} placeholder="e.g. $120k - $150k" />
            <FormField label="Available From" name="availableFrom" type="date" 
              register={register} error={errors.availableFrom?.message} placeholder="" />
          </div>
          <label 
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer
              border-2 border-dashed border-[#405673] hover:border-[#10B77F] rounded-lg bg-transparent 
              hover:bg-[#405673]/10 focus-within:border-[#10B77F] transition-all
              ${errors.resume ? 'border-red-500' : 'border-[#405673]'}`}>
            <div className="flex flex-col items-center justify-center py-4">
              <CloudUpload className={`h-10 w-10 mb-2 ${errors.resume ? 'text-red-500' : 'text-[#405673]'}`} />
              <div className="text-center">
                <h1 className="text-sm font-semibold text-gray-200">Click to upload Resume</h1>
                <p className="text-xs text-gray-400">PDF under 5MB</p>
              </div>
            </div>
            
            <input id="cv-upload" type="file" accept="application/pdf" {...register("resume")} hidden />
          </label>
        </section>
      </div>

      <footer className="mt-8 flex justify-end">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-48 bg-[#10B77F] hover:bg-[#0d9668] disabled:bg-gray-600 text-black font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-[#10B77F]/20"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </footer>
    </form>
  );
}