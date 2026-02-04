import { useAuthStore } from '@/utils/ZuStand';
import { useState } from 'react';
import { ProfileForm } from '@/components/ProfileForm'
import { Plus, ChevronLeft, GraduationCap, Briefcase, Award } from 'lucide-react';
import ProfessionalInformations from '@/components/ProfitionalInformations';

export function Profile() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const BACKEND_URL = "http://localhost:3000";
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;
  console.log(avatarUrl)
  console.log(profile);

  const [skills] = useState([
    { id: 1, type: 'HTML/CSS' },
    { id: 2, type: 'Figma' },
    { id: 3, type: 'React' }
  ]);

  const [education] = useState([
    { id: 1, school: '1337 Coding School', type: 'Common Core', year: '2026' }
  ]);

  const [career] = useState([
    { id: 1, company: "Full Stack Developer", location: 'Casablanca, MA', start: '2024', end: 'Present' }
  ]);

  return (
    <div className="flex flex-col w-full h-full p-6 gap-6 overflow-y-auto no-scrollbar">

      {/* Main Glassmorphic Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left: Career/Experience Section */}
        <div className="lg:col-span-4 bg-[#161F32] rounded-3xl p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Briefcase className="text-[#5F88B8]" size={22} />
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

        {/* Center: Personal Info (Profile Card) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative mb-6">
            <div 
              style={{ backgroundImage: `url("${user?.avatarUrl ? avatarUrl : "/icons/placeholder.jpg"}")` }}
              className="h-32 w-32 rounded-3xl bg-cover bg-center border-4 border-[#161F32] shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#5F88B8] p-2 rounded-xl border-4 border-[#0D1525]">
              <Award size={18} className="text-white" />
            </div>
          </div>
          
          <div className="w-full bg-[#161F32] rounded-3xl p-6 border border-gray-800 shadow-xl">
            <ProfileForm user={user} />
          </div>
        </div>

        {/* Right: Skills & Education Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Skills */}
          <div className="bg-[#161F32] rounded-3xl p-6 border border-gray-800 shadow-xl flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Top Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="px-4 py-2 bg-[#1C263B] text-gray-300 text-sm rounded-xl border border-gray-700">
                  {skill.type}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-[#161F32] rounded-3xl p-6 border border-gray-800 shadow-xl flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <GraduationCap className="text-[#5F88B8]" size={20} />
                Education
              </h2>
            </div>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="border-l-2 border-[#5F88B8] pl-4 py-1">
                  <p className="text-white font-medium text-sm">{edu.school}</p>
                  <p className="text-gray-500 text-xs">{edu.type} • {edu.year}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}