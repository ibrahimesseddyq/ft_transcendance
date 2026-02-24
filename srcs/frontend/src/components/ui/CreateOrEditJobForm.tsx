import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";

type JobFormData = z.infer<typeof CreateJobSchema>;
interface props{
  jobItem?: any; 
  setIsFormOpen: (open: boolean) => void ;
  setJobsArray: (open: any) => void ;
}

interface InputFieldProps {
  name: keyof JobFormData;
  register: any;
  error?: string;
  placeholder: string;
  type?: string;
}
const inputClass = "h-11 w-full text-sm text-white outline-none px-3 \
    border border-[#405673] rounded-md bg-transparent focus:border-[#10B77F] transition-colors oveflow-auto custom-scrollbar";

const CreateOrEditJobForm = ({ jobItem, setIsFormOpen, setJobsArray }: props) => {
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
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    if (jobItem){
      // console.log("job id is : ",  jobItem.id);
      try {
        const response = await fetch(`${BACKEND_URL}/api/jobs/${jobItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: 'include'
        });
        
        if (!response.ok)
          throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
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
        const response = await fetch(`${BACKEND_URL}/api/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });
        
        if (!response.ok)
          throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
        const savedJob = result.data;
        setJobsArray((prev:any) => [savedJob, ...prev]);
        Notification("Job added successfully!", "success");
        setIsFormOpen(false);
      } catch (error) {
        console.error("Submission failed:", error);
        Notification("Error creating job", "error");
      }
    }
    reset();
  };

  const selectClass = "h-11 w-full text-sm text-white border bg-[#1d273e] border-[#405673] \
    outline-none focus:border-[#10B77F] transition-colors rounded-md px-3 cursor-pointer appearance-none";

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className='border rounded-xl px-5 py-2 border-[#1e2e52] bg-[#121b31] mb-6'>
        <h1 className='text-white text-lg font-bold'>Post New Job</h1>
      </div>

      <div className='h-auto w-full max-w-[500px] bg-[#121b31]/50 p-6 rounded-2xl border border-[#1e2e52] max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl'>
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
              {errors.department && <p className="mt-1 text-red-400 text-[10px] italic">{errors.department.message}</p>}
            </div>
          </div>

          {/* Location & Remote Toggle */}
          <div className='flex flex-col sm:flex-row gap-3 items-center'>
              <InputField name="location" 
                register={register} error={errors.location?.message} placeholder="Location (City, Country)" />
                <div className='flex-1 flex items-center gap-2 px-2'>
                  <input type="checkbox" {...register("isRemote")} id="isRemote" className="accent-[#10B77F] h-4 w-4" />
                  <label htmlFor="isRemote" className="text-white text-sm cursor-pointer">Remote</label>
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
                {errors.salaryCurrency && <p className="mt-1 text-red-400 text-[10px] italic">{errors.salaryCurrency.message}</p>}
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

          {/* Skills / Tags Section */}
          <div className='flex-1'>
            <textarea 
              {...register("skills")} 
              placeholder="e.g. UI, UX, Figma, React (separate with commas)" 
              className={`${inputClass} h-auto py-2 resize-none focus:border-[#00adef]`}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
                register("skills").onChange(e); 
              }}
            />
            {errors.skills && (<p className="text-red-400 text-[10px] italic">{errors.skills.message}</p>)}
          </div>

          {/* Requirements */}
          <div className='flex-1'>
            <textarea {...register("requirements")}
              placeholder="Requirements (one per line or comma separated)" rows={2} 
              className={`${inputClass} h-auto py-2 resize-none`} />
          </div>

          {/* Description */}
          <div className='flex-1'>
            <textarea {...register("description")}
              placeholder="Job Description" rows={4}
              className="w-full text-sm text-white outline-none p-3 border border-[#405673] 
                rounded-md bg-transparent focus:border-[#10B77F] resize-none oveflow-auto custom-scrollbar" />
            {errors.description && <p className="mt-1 text-red-500 text-[10px]">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} 
              className="h-11 flex-1 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            {jobItem ? 
              <button type="submit"
                className="h-11 flex-1 text-black font-bold rounded-lg bg-[#10B77F] hover:bg-[#0d9668] transition-colors">
                Save
              </button>
               : 
              <button type="submit" 
                className="h-11 flex-1 text-black font-bold rounded-lg bg-[#10B77F] hover:bg-[#0d9668] transition-colors">
                Create Job
              </button>
            }
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
      {error && <p className="mt-1 text-red-400 text-[10px] italic">{error}</p>}
    </div>
);}

export default CreateOrEditJobForm;