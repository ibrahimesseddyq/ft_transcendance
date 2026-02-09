import { useState } from 'react';
import { GraduationCap } from 'lucide-react';


const EducationCard = () =>{
    const [education] = useState([
        { id: 1, school: '1337 Coding School', type: 'Common Core', year: '2026' }
    ]);

    return (
      <div className="flex-1 w-full md:w-auto p-6 border maincard">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pramary-text text-xl flex items-center gap-2">
            <GraduationCap size={20} />
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
     
    );
}

export default EducationCard;