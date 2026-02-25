import { useState } from 'react';
import { GraduationCap } from 'lucide-react';

const EducationCard = () => {
    const [education] = useState([
      { id: 1, school: '1337 Coding School', type: 'Common Core', year: '2026' },
      { id: 2, school: '1337 Coding School', type: 'Common Core', year: '2026' },
      { id: 3, school: '1337 Coding School', type: 'Common Core', year: '2026' }
    ]);

    return (
      <div className="flex-1 w-full md:w-auto p-2 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pramary-text text-xl font-bold flex items-center gap-2">
            <GraduationCap size={20} className="text-[#5F88B8] dark:text-[#00adef]" />
            Education
          </h2>
        </div>

        {education.length > 0 ? (
          <div className="space-y-6 pl-2 mt-4">
            {education.map(edu => (
              <div key={edu.id} className="flex flex-col gap-1 border-l-2 border-[#5F88B8] dark:border-[#00adef] pl-4">
                <p className="text-black dark:text-gray-100 font-bold text-sm">
                  {edu.school}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  {edu.type} <span className="mx-1">•</span> {edu.year}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
             <p className="text-[#5F88B8] dark:text-gray-500 text-xs text-center italic">
               No Education Available
             </p>
          </div>
        )}
      </div>
    );
}
export default EducationCard;