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
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(CandidateProfileSchema),
    defaultValues: {
      userId: userId,
      numberPhone: '0',
    }
  });

  let avatarValue = watch('avatar');
  console.log("avatarValue : ", avatarValue);

  
  const onApplySubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("linkedinUrl", data.linkedinUrl);
    formData.append("currentTitle", data.currentTitle);
    formData.append("numberPhone", data.currentTitle);
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
        const response = await fetch(`${BACKEND_URL}/api/profiles/${data.userId}`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          setProfile(result.data);
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
      className="max-w-screen-2xl p-6 overflow-y-auto custom-scrollbar bg-transparent items-center">
      
      <header className="border-b border-gray-800 pb-4 w-full">
        <h1 className="text-black text-2xl font-bold">Profile Setup</h1>
        <p className="text-gray-500 text-sm">Manage your professional presence and job preferences.</p>
      </header>

      <div className={`relative h-32 w-32 rounded-full bg-[#1e1e1e] 
          bg-cover bg-center border-2 mx-auto my-5
          ${errors.avatar ? 'border-red-500' : avatarValue ? 'border-green-500' : 'border-[#00adef]'}`}
          style={{ backgroundImage: `url(${avatarPreview})`}}>
        <input 
          id="avatar"
          type='file'
          accept="image/*"
          {...register("avatar")} 
          onChange={handleImageChange}
          className="hidden"
        />
        <label htmlFor="avatar" className="text-center h-full w-full p-2">
          <SquarePen
            className="absolute top-0 right-2 h-5 w-5 text-black 
              hover:text-[#00adef] bg-white rounded-md cursor-pointer" />
        </label>
      </div>
      {errors.avatar && <p className="text-center mb-1 text-red-400 text-[10px] italic ">{errors.avatar.message}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 w-full">
        {/* Professional Info */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[#00adef] text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#00adef] rounded-full" />
            Professional Information
          </h2>
          
          <div className="flex flex-col gap-5 pl-4">
            <FormField label="LinkedIn URL" name="linkedinUrl" optional={false} register={register} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
            <FormField label="Portfolio URL" name="portfolioUrl" optional={true} register={register} error={errors.portfolioUrl?.message} placeholder="https://yourwork.com" />
            <FormField label="Current Company" name="currentCompany" optional={true} register={register} error={errors.currentCompany?.message} placeholder="Company Name" />
            <FormField label="Current Job Title" name="currentTitle" optional={false} register={register} error={errors.currentTitle?.message} placeholder="Ex: Software Engineer" />
            <FormField label="Years of Experience" name="yearsExperience" optional={true} register={register} error={errors.yearsExperience?.message} placeholder="5" />
            <FormField label="Skills" name="skills" optional={true} register={register} error={errors.skills?.message} placeholder="Ex: React, Node.js, TypeScript..." />
          </div>
        </section>

        {/* Job Preferences */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[#00adef] text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#00adef] rounded-full" />
            Job Preferences
          </h2>
          
          <div className="flex flex-col gap-5 pl-4">
            <FormField label="Preferred Locations" name="preferredLocations" optional={true} register={register} error={errors.preferredLocations?.message} placeholder="Remote, New York, London" />
              <FormField label="Salary Expectation" name="salaryExpectation" optional={true} register={register} error={errors.salaryExpectation?.message} placeholder="e.g. $120k - $150k" />
              <FormField label="Number Phone" name="numberPhone" optional={false} register={register} error={errors.numberPhone?.message} placeholder="e.g. 0699999999" />
          </div>

          <label 
            className={`flex flex-col items-center justify-center w-full h-full cursor-pointer
              border-2 border-dashed rounded-lg bg-[#00adef]/5 
               focus-within:border-[#00adef] transition-all
              ${errors.resume ? 'border-red-500' : 'border-gray-800 hover:border-[#00adef]'}`}>
            <div className="flex flex-col items-center justify-center py-4">
              <CloudUpload className={`h-10 w-10 mb-2 ${errors.resume ? 'text-red-500' : 'text-gray-600'}`} />
              <div className="text-center">
                <h1 className="text-sm font-semibold text-gray-300">Click to upload Resume</h1>
                <p className="text-xs text-gray-500">PDF under 5MB</p>
              </div>
            </div>
            <input  id="cv-upload" type="file" accept="application/pdf" {...register("resume")} hidden />
          </label>
          {errors.resume && <p className="mt-1 text-red-400 text-[10px] italic mx-auto">{errors.resume.message}</p>}
        </section>
      </div>

      <footer className="mt-8 flex gap-2 justify-end">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-48 bg-[#00adef] hover:bg-[#0086b8] disabled:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-[#00adef]/20"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
        <Logout />
      </footer>
    </form>
  );
}