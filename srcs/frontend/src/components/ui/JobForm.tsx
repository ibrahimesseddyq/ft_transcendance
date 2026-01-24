import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";

type JobFormData = z.infer<typeof CreateJobSchema>;

const JobForm = ({ setIsFormOpen }: { setIsFormOpen: (open: boolean) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<JobFormData>({
    resolver: zodResolver(CreateJobSchema) as any,
    defaultValues: {
      title: "",
      department: "",
      description: "",
      requirements: "",
      location: "",
      isRemote: false,
      employmentType: "",
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: "USD",
      status: "open",
    }
  });

  const JobSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      Notification("Job added successfully!", "success");
      setIsFormOpen(false);
      reset();
    } catch (error) {
      console.error("Submission failed:", error);
      Notification("Error creating job", "error");
    }
  };

  const inputClass = "h-11 w-full text-sm text-white outline-none px-3 \
    border border-[#405673] rounded-md bg-transparent focus:border-[#10B77F] transition-colors oveflow-auto custom-scrollbar";
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
            <div className='flex-1'>
              <input {...register("title")} placeholder="Job Title" className={inputClass} />
              {errors.title && <p className="mt-1 text-red-500 text-[10px]">{errors.title.message}</p>}
            </div>
            <div className='flex-1'>
              <input {...register("department")} placeholder="Department" className={inputClass} />
              {errors.department && <p className="mt-1 text-red-500 text-[10px]">{errors.department.message}</p>}
            </div>
          </div>

          {/* Location & Remote Toggle */}
          <div className='flex flex-col sm:flex-row gap-3 items-center'>
            <div className='flex-2 w-full'>
              <input {...register("location")} placeholder="Location (City, Country)" className={inputClass} />
              {errors.location && <p className="mt-1 text-red-500 text-[10px]">{errors.location.message}</p>}
            </div>
            <div className='flex-1 flex items-center gap-2 px-2'>
              <input type="checkbox" {...register("isRemote")} id="isRemote" className="accent-[#10B77F] h-4 w-4" />
              <label htmlFor="isRemote" className="text-white text-sm cursor-pointer">Remote</label>
            </div>
          </div>

          {/* Salary Min, Max & Currency */}
          <div className='flex flex-col sm:flex-row gap-2'>
            <div className='flex-1'>
              <input type='text' {...register("salaryMin", { valueAsNumber: true })} placeholder="Min Salary" className={inputClass} />
              {errors.salaryMin && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryMin.message}</p>}
            </div>
            <div className='flex-1'>
              <input type='text' {...register("salaryMax", { valueAsNumber: true })} placeholder="Max Salary" className={inputClass} />
              {errors.salaryMax && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryMax.message}</p>}
            </div>
            <div className='w-20'>
              <input {...register("salaryCurrency")} placeholder="USD" className={inputClass} maxLength={3} />
              {errors.salaryCurrency && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryCurrency.message}</p>}
            </div>
          </div>

          {/* Employment Type & Status */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input {...register("employmentType")} placeholder="Full-time, Contract..." className={inputClass} />
              {errors.employmentType && <p className="mt-1 text-red-500 text-[10px]">{errors.employmentType.message}</p>}
            </div>
            <div className='flex-1 '>
              <select {...register("status")} className={`${selectClass}`}>
                  <option value="open" className="bg-[]">Open</option>
                  <option value="closed">Closed</option>
                  <option value="draft">archived</option>
              </select>
            </div>
          </div>

          {/* Requirements */}
          <div className='flex-1'>
            <textarea {...register("requirements")} placeholder="Requirements (one per line or comma separated)" rows={2} 
              className={`${inputClass} h-auto py-2 resize-none`} />
          </div>

          {/* Description */}
          <div className='flex-1'>
            <textarea {...register("description")} placeholder="Job Description" rows={4} 
              className="w-full text-sm text-white outline-none p-3 border border-[#405673] 
                rounded-md bg-transparent focus:border-[#10B77F] resize-none oveflow-auto custom-scrollbar" />
            {errors.description && <p className="mt-1 text-red-500 text-[10px]">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="h-11 flex-1 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" className="h-11 flex-1 text-black font-bold rounded-lg bg-[#10B77F] hover:bg-[#0d9668] transition-colors">
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;