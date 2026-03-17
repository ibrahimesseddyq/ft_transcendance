import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";
import { mainService } from '@/utils/Api';

type JobFormData = z.infer<typeof CreateJobSchema>;
interface props{
  jobItem?: any; 
  setIsFormOpen: (open: boolean) => void ;
  setJobsArray: (open: any) => void ;
  setTotalPages: (TotalePages: number) => void;
}

interface InputFieldProps {
  name: keyof JobFormData;
  register: any;
  error?: string;
  placeholder: string;
  type?: string;
}
const inputClass = "h-11 w-full text-sm dark:text-surface-main dark:text-white outline-none px-3 \
    border border-[#405673] rounded-md bg-transparent focus:border-accent transition-colors oveflow-auto custom-scrollbar";

const CreateOrEditJobForm = ({ jobItem, setIsFormOpen, setJobsArray, setTotalPages }: props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<JobFormData>({
    resolver: zodResolver(CreateJobSchema) as any,
    defaultValues: jobItem ? {
      title: jobItem.title,
      department: jobItem.department,
      description: jobItem.description,
      requirements: jobItem.requirements,
      skills: jobItem.skills,
      location: jobItem.location,
      isRemote: jobItem.isRemote,
      employmentType: jobItem.employmentType,
      salaryMin: jobItem.salaryMin,
      salaryMax: jobItem.salaryMax,
      salaryCurrency: jobItem.salaryCurrency,
      status: jobItem.status,
    } : {
      title: "",
      department: "engineering",
      description: "",
      requirements: "",
      skills: "",
      location: "",
      isRemote: false,
      employmentType: "full-time",
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: "USD",
      status: "open",
    },
  });

  const JobSubmit = async (data: JobFormData) => {
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    if (jobItem){
      try {
        const response = await mainService.patch(`${env_main_api}/jobs/${jobItem.id}`, data);

        const result = response.data;
        const savedJob = result.data;
        Notification("Job updated successfully!", "success");

        setJobsArray((prev:any) => 
          prev.map((job:any) => (job.id === jobItem.id ? savedJob : job))
        );
        setIsFormOpen(false);
      } catch (error) {
        console.error("updated failed:", error);
        Notification("Error updating job", "error");
      }
    }else{
      try {
        await mainService.post(`${env_main_api}/jobs`, data);
        const limit = 6;
        const params = new URLSearchParams();
        params.append("limit", String(limit));
        const url = `${env_main_api}/jobs?${params.toString()}`;
        const [filter_res] = await Promise.all([
          mainService.get(url),
          new Promise(resolve => setTimeout(resolve, 800))
        ]);
        const result = filter_res.data; 
        if (result) {
          setJobsArray(result.data || []);
          setTotalPages(result.meta?.totalPages || 1);
        }
        Notification("Job added successfully!", "success");
        setIsFormOpen(false);
      } catch (error) {
        console.error("Submission failed:", error);
        Notification("Error creating job", "error");
      }
    }
    reset();
  };

  const selectClass = "h-11 w-full text-sm text-black dark:text-surface-main border \
    bg-gray-50 dark:bg-[#1d273e] border-gray-300 dark:border-[#405673] \
    outline-none focus:border-accent transition-colors rounded-md px-3 cursor-pointer appearance-none";

  const inputClass = "h-11 w-full text-sm text-black dark:text-surface-main border \
    bg-gray-50 dark:bg-[#1d273e] border-gray-300 dark:border-[#405673] \
    outline-none focus:border-accent transition-colors rounded-md px-3";

  return (
    <div className="h-full w-full max-w-screen-xl flex flex-col items-center transition-colors duration-300 p-4">
      {/* Header Badge */}
      <div className='border rounded-xl px-5 py-2 border-gray-200 dark:border-[#1e2e52] bg-surface-main dark:bg-[#121b31] mb-6 shadow-sm'>
        <h1 className='text-black dark:text-surface-main text-lg font-bold'>Post New Job</h1>
      </div>

      {/* Form Container */}
      <div className='h-auto w-full bg-surface-main dark:bg-[#121b31]/50 p-6 
        rounded-2xl border border-gray-200 dark:border-[#1e2e52] 
         overflow-y-auto custom-scrollbar shadow-2xl'>
        <form onSubmit={handleSubmit(JobSubmit)} className='flex flex-col gap-4 w-full'>
          
          {/* Title & Department */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <InputField name="title" register={register} error={errors.title?.message} placeholder="Job Title" />
            
            <div className="flex-1">
              <select {...register("department")} className={selectClass}>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
              {errors.department && <p className="mt-1 text-danger-hover text-[10px] italic">{errors.department.message}</p>}
            </div>
          </div>

          {/* Location & Remote Toggle */}
          <div className='flex flex-col sm:flex-row gap-3 items-center'>
              <InputField name="location" 
                register={register} error={errors.location?.message} placeholder="Location (City, Country)" />
                <div className='flex-1 flex items-center gap-2 px-2'>
                  <input type="checkbox" {...register("isRemote")} id="isRemote" className="accent-accent h-4 w-4" />
                  <label htmlFor="isRemote" className="text-black dark:text-surface-main text-sm cursor-pointer">Remote</label>
              </div>
          </div>

          {/* Salary Min, Max & Currency */}
          <div className='flex flex-col sm:flex-row gap-2'>
            <div className='flex-1'>
              <input type='number' {...register("salaryMin", { valueAsNumber: true })} placeholder="Min Salary" className={inputClass} />
              {errors.salaryMin && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryMin.message}</p>}
            </div>
            <div className='flex-1'>
              <input type='number' {...register("salaryMax", { valueAsNumber: true })} placeholder="Max Salary" className={inputClass} />
              {errors.salaryMax && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryMax.message}</p>}
            </div>
            <div className='w-20'>
                <select {...register("salaryCurrency")} className={selectClass}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MAD">MAD</option>
                </select>
                {errors.salaryCurrency && <p className="mt-1 text-danger-hover text-[10px] italic">{errors.salaryCurrency.message}</p>}
            </div>
          </div>

          {/* Employment Type & Status */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <select {...register("employmentType")} className={selectClass}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div className='flex-1'>
              <select {...register("status")} className={selectClass}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className='flex-1'>
            <textarea {...register("skills")}
              placeholder="Job skills" rows={4}
              className="w-full text-sm text-black dark:text-surface-main outline-none p-3 border border-gray-300 dark:border-[#405673] 
                rounded-md bg-gray-50 dark:bg-transparent focus:border-accent resize-none overflow-auto custom-scrollbar" />
            {errors.skills && <p className="mt-1 text-red-500 text-[10px]">{errors.skills.message}</p>}
          </div>
    
          {/* Requirement */}
          <div className='flex-1'>
            <textarea {...register("requirements")}
              placeholder="Job requirements" rows={4}
              className="w-full text-sm text-black dark:text-surface-main outline-none p-3 border border-gray-300 dark:border-[#405673] 
                rounded-md bg-gray-50 dark:bg-transparent focus:border-accent resize-none overflow-auto custom-scrollbar" />
            {errors.requirements && <p className="mt-1 text-red-500 text-[10px]">{errors.requirements.message}</p>}
          </div>

          {/* Description */}
          <div className='flex-1'>
            <textarea {...register("description")}
              placeholder="Job Description" rows={4}
              className="w-full text-sm text-black dark:text-surface-main outline-none p-3 border border-gray-300 dark:border-[#405673] 
                rounded-md bg-gray-50 dark:bg-transparent focus:border-accent resize-none overflow-auto custom-scrollbar" />
            {errors.description && <p className="mt-1 text-red-500 text-[10px]">{errors.description.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} 
              className="h-11 flex-1 text-gray-700 dark:text-surface-main border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit"
                className="h-11 flex-1 text-surface-main dark:text-black font-bold rounded-lg bg-accent hover:bg-[#0d9668] transition-colors shadow-lg shadow-accent/20">
                {jobItem ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
);
}

const InputField = ({name, register, error, placeholder, type }: InputFieldProps) => {
  return(
    <div className="flex-1">
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={inputClass}
      />
      {error && <p className="mt-1 text-danger-hover text-[10px] italic">{error}</p>}
    </div>
);}

export default CreateOrEditJobForm;