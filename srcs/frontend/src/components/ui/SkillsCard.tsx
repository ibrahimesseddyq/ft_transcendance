interface props {
  profile: any;
}

const SkillsCard = ({ profile }: props) => {
  const skills = typeof profile?.skills === 'string'
    ? profile.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
    : [];
  
  return (
    <div className="flex-1 w-full p-2 sm:p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#00adef] font-semibold text-lg sm:text-xl flex items-center gap-2">Top Skills</h2>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span 
              key={`${skill}-${index}`} 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-50 text-sky-800 text-sm rounded-xl border border-sky-200
                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-2">No skills available</p>
      )}
    </div>
  );
}

export default SkillsCard;