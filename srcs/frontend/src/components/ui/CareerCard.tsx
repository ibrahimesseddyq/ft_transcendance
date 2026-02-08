import { useState } from 'react';
import { Briefcase } from 'lucide-react';


const CareerCard = () =>{
    const [career] = useState([
        { id: 1, company: "Full Stack Developer", location: 'Casablanca, MA', start: '2024', end: 'Present' }
      ]);
    return (
      <div className="flex-1 w-full md:w-auto lg:col-span-4 
         p-6 border maincard">
          <div className="flex items-center justify-between mb-6">
            <h2 className="pramary-text text-xl flex items-center gap-2">
              <Briefcase  size={22} />
              Career
            </h2>
          </div>
          <div className="space-y-4">
            {career.map((job) => (
              <div key={job.id} className="p-4 bg-[#1C263B] rounded-2xl border border-gray-700">
                <p className="text-white font-semibold">{job.company}</p>
                <p className="text-gray-400 text-sm">{job.location}</p>
                <p className="text-[#5F88B8] text-xs mt-2">{job.start} - {job.end}</p>
              </div>
            ))}
          </div>
      </div>
    );
  }

export default CareerCard;