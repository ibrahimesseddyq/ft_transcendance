import { useState } from 'react';
import { Briefcase } from 'lucide-react';

const SkillsCard = () =>{
    const [skills] = useState([
        { id: 1, type: 'HTML/CSS' },
        { id: 2, type: 'Figma' },
        { id: 3, type: 'React' }
    ]);
    return (
      <div className="flex-1 w-full md:w-auto p-6 border maincard">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pramary-text text-xl flex items-center gap-2">Top Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="px-4 py-2 bg-[#1C263B] text-gray-300 text-sm rounded-xl border border-gray-700">
              {skill.type}
            </span>
          ))}
        </div>
      </div>
    );
}
export default SkillsCard;