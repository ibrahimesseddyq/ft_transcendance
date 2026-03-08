interface props {
  profile: any;
}

const SkillsCard = ({ profile }: props) => {
  
  return (
    <div className="flex-1 w-full md:w-auto p-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="pramary-text text-xl flex items-center gap-2">Top Skills</h2>
      </div>
      
      {profile?.skills && profile.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {profile.skills.split(',').map((skill: string, index: number) => (
            <span 
              key={`${skill.trim()}-${index}`} 
              className="px-4 py-2 bg-[#1C263B] text-gray-300 text-sm rounded-xl border border-gray-700"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[#5F88B8] text-xs text-center mt-2">No Skills Available</p>
      )}
    </div>
  );
}

export default SkillsCard;