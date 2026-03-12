import UserCard from '@/components/ui/UserCard';
import { useNavigate } from 'react-router-dom';

interface Props {
  Title: string;
  applications: any;
}

const ApplicationContent = ({ Title, applications }: Props) => {
  const navigate = useNavigate();

  const handleSeeAll = () => {
    navigate('/AppAllCards', { 
      state: {
        title: Title, 
        users: applications
      } 
    });
  };
  
  const limitedUsers = applications.slice(0, 6);
  console.log("limitedUsers: ", limitedUsers);
  const hasMore = applications.length > 6;
  
  return (
    <div className="relative flex flex-col w-full min-h-40 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-surface-main dark:bg-secondary-darkbg shadow-sm transition-colors duration-300">
      
      <header className="flex items-center justify-between bg-gradient-to-r from-primary to-[#161F32] dark:to-slate-950 h-14 w-full sticky top-0 z-20 px-5">
        <h3 className="text-surface-main font-bold text-lg">{Title}</h3>
        <span className="text-surface-main/80 text-xs font-medium bg-surface-main/10 dark:bg-black/20 px-3 py-1 rounded-full">
          {applications.length} Total
        </span>
      </header>

      <div className="flex flex-wrap gap-6 items-center p-6 pb-16 justify-center sm:justify-start">
        {limitedUsers.length > 0 ? (
          limitedUsers.map((item:any) => (
            <UserCard 
              key={item.id} 
              candidateId={item.candidateId}
              applicationId={item.id}
            />
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-slate-400 dark:text-slate-500 italic">No applications found.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <button onClick={handleSeeAll}
          className="absolute right-6 bottom-4 text-primary hover:text-[#2845D6] dark:hover:text-[#5bc8f5]
            hover:underline font-bold text-sm transition-colors">
          See all ({applications.length - 6} more)
        </button>
      )}
    </div>
  );
};

export default ApplicationContent;