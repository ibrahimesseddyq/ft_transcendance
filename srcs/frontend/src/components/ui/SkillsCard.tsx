import { useState } from 'react';

const SkillsCard = () =>{
    const [skills] = useState([
        { id: 1, type: 'HTML/CSS' },
        { id: 2, type: 'Figma' },
        { id: 3, type: 'React' }
    ]);
    return (
      <div className="flex-1 w-full md:w-auto p-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pramary-text text-xl flex items-center gap-2">Top Skills</h2>
        </div>
      {skills.length > 0
        ? 
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="px-4 py-2 bg-[#1C263B] text-gray-300 text-sm rounded-xl border border-gray-700">
              {skill.type}
            </span>
          ))}
        </div>
        :
        <p className="text-[#5F88B8] text-xs text-center mt-2">No Skills Available</p>
      }
      </div>
    );
}
export default SkillsCard;