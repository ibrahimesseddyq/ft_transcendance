import { useState } from 'react';
import { GraduationCap } from 'lucide-react';


const EducationCard = () =>{
    const [education] = useState([
      { id: 1, school: '1337 Coding School', type: 'Common Core', year: '2026' },
      { id: 2, school: '1337 Coding School', type: 'Common Core', year: '2026' },
      { id: 3, school: '1337 Coding School', type: 'Common Core', year: '2026' }
    ]);

    return (
      <div className="flex-1 w-full md:w-auto p-2 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pramary-text text-xl flex items-center gap-2">
            <GraduationCap size={20} />
            Education
          </h2>
        </div>
        {education.length > 0
          ?
          <div className="space-y-4 pl-2">
            {education.map(edu => (
              <div key={edu.id} className="flex flex-col gap-2 border-l-2 border-[#5F88B8] pl-4">
                <p className="text-black font-medium text-sm">{edu.school}</p>
                <p className="text-gray-500 text-xs">{edu.type} • {edu.year}</p>
              </div>
            ))}
          </div>
          :
          <p className="text-[#5F88B8] text-xs text-center mt-2">No Education Available</p>
        }
      </div>
    );
}

export default EducationCard;