interface props {
  profile: any;
}

const SkillsCard = ({ profile }: props) => {
  const skills = typeof profile?.skills === 'string'
    ? profile.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
    : [];
  
  return (
    <div className="flex-1 w-full p-2 sm:p-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">Top Skills</h2>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span 
              key={`${skill}-${index}`} 
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No skills available</p>
      )}
    </div>
  );
}

export default SkillsCard;