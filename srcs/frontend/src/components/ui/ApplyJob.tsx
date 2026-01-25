import { useForm } from "react-hook-form";
import { CloudUpload } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplyJobSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification";

type ApplyJobFormData = z.infer<typeof ApplyJobSchema>;
interface props{
  job?: any; 
  setIsFormOpen: (open: boolean) => void ;
}

const ApplyJob = ({ job, setIsFormOpen }: props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ApplyJobFormData>({
    resolver: zodResolver(ApplyJobSchema) as any,
  });

  const ApplySubmit = async (data: ApplyJobFormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok)
        throw new Error(`Server error: ${response.status}`);
      
      Notification("Job added successfully!", "success");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
      Notification("Error creating job", "error");
    }
    reset();
  };

  const inputClass = "h-11 w-full text-sm text-white outline-none px-3 \
    border border-[#405673] rounded-md bg-transparent focus:border-[#10B77F] transition-colors oveflow-auto custom-scrollbar";
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className='border rounded-xl px-5 py-2 border-[#1e2e52] bg-[#121b31] mb-6'>
        <h1 className='text-white text-lg font-bold'>Apply for Job</h1>
      </div>

      <div className='h-auto w-full max-w-[500px] bg-[#121b31]/50 p-6 rounded-2xl border border-[#1e2e52] max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl'>
        <form onSubmit={handleSubmit(ApplySubmit)} className='flex flex-col gap-4 w-full'>

            <div className='flex-1'>
              <input {...register("fullName")} placeholder="fullName" className={inputClass} />
              {errors.fullName && <p className="mt-1 text-red-500 text-[10px]">{errors.fullName.message}</p>}
            </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input {...register("phoneNumber")} placeholder="phoneNumber" className={inputClass} />
              {errors.phoneNumber && <p className="mt-1 text-red-500 text-[10px]">{errors.phoneNumber.message}</p>}
            </div>
            <div className='flex-1'>
              <input {...register("email")} placeholder="email" className={inputClass} />
              {errors.email && <p className="mt-1 text-red-500 text-[10px]">{errors.email.message}</p>}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input {...register("linkedinUrl")} placeholder="linkedinUrl" className={inputClass} />
              {errors.linkedinUrl && <p className="mt-1 text-red-500 text-[10px]">{errors.linkedinUrl.message}</p>}
            </div>
            <div className='flex-1'>
              <input {...register("portfolioUrl")} placeholder="portfolioUrl" className={inputClass} />
              {errors.portfolioUrl && <p className="mt-1 text-red-500 text-[10px]">{errors.portfolioUrl.message}</p>}
            </div>
          </div>


          <textarea {...register("coverLetter")} placeholder="coverLetter"
            className="w-full h-[120px] text-sm text-white outline-none p-3 border border-[#405673] 
              rounded-md bg-transparent focus:border-[#10B77F] resize-none oveflow-auto custom-scrollbar"/>
          {errors.coverLetter && <p className="mt-1 text-red-500 text-[10px]">{errors.coverLetter.message}</p>}
            <div className="relative">
              <label 
                className={`flex flex-col items-center justify-center w-full min-h-[120px] cursor-pointer
                            border-2 border-dashed border-[#405673] rounded-lg bg-transparent 
                            hover:bg-[#405673]/10 focus-within:border-[#10B77F] transition-all
                            ${errors.cv ? 'border-red-500' : 'border-[#405673]'}`}>
                <div className="flex flex-col items-center justify-center py-4">
                  <CloudUpload className={`h-10 w-10 mb-2 ${errors.cv ? 'text-red-500' : 'text-[#405673]'}`} />
                  <div className="text-center">
                    <h1 className="text-sm font-semibold text-gray-200">Click to upload CV</h1>
                    <p className="text-xs text-gray-400">PDF under 5MB</p>
                  </div>
                </div>
                
                <input id="cv-upload" type="file" {...register("cv")} hidden />
              </label>
              {errors.cv && (<p className="mt-2 text-red-500 text-xs font-medium italic">{errors.cv.message}</p>)}
            </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} 
                className="h-11 flex-1 text-black font-bold rounded-lg 
                    bg-[#10B77F] hover:bg-[#0d9668] transition-colors">
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;