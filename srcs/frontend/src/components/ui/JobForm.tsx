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
      employmentType: "",
      salaryMin: 0,
    }
  });

  const JobSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/jobs", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
      }
      Notification("Job added successfully!", "success");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsFormOpen(false);
      Notification("error Create Job field", "error");
    } finally{
      
    }
    reset();
  };

  const inputClass = "h-11 w-full text-sm text-white outline-none px-3 \
    border border-[#405673] rounded-md bg-transparent focus:border-[#10B77F] transition-colors";

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className='border rounded-xl px-5 py-2 border-[#1e2e52] bg-[#121b31] mb-6'>
        <h1 className='text-white text-lg font-bold'>Post New Job</h1>
      </div>

      <div className='h-auto w-full max-w-[450px] bg-[#121b31]/50 p-6 rounded-2xl border border-[#1e2e52] max-h-[80vh] overflow-y-auto custom-scrollbar shadow-2xl'>
        <form onSubmit={handleSubmit(JobSubmit)} className='flex flex-col gap-4 w-full'>
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

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input {...register("requirements")} placeholder="Job requirements" className={inputClass} />
              {errors.requirements && <p className="mt-1 text-red-500 text-[10px]">{errors.requirements.message}</p>}
            </div>
            <div className='flex-1'>
              <input {...register("location")} placeholder="location" className={inputClass} />
              {errors.location && <p className="mt-1 text-red-500 text-[10px]">{errors.location.message}</p>}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input type='number' {...register("salaryMin", { valueAsNumber: true })} placeholder="salaryMin" className={inputClass} />
              {errors.salaryMin && <p className="mt-1 text-red-500 text-[10px]">{errors.salaryMin.message}</p>}
            </div>

            <div className='flex-1'>
                <input {...register("employmentType")} placeholder="employmentType" className={inputClass} />
                {errors.employmentType && <p className="mt-1 text-red-500 text-[10px]">{errors.employmentType.message}</p>}
            </div>
          </div>

          <div className='flex-1'>
            <textarea {...register("description")} placeholder="Description" rows={3} className="w-full text-sm text-white outline-none p-3 border border-[#405673] rounded-md bg-transparent focus:border-[#10B77F] resize-none" />
            {errors.description && <p className="mt-1 text-red-500 text-[10px]">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={()=>{setIsFormOpen(false)}} className="h-11 flex-1 text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">Cancel</button>
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