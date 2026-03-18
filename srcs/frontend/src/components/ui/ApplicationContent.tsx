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
  const hasMore = applications.length > 6;
  
  return (
    <div className="relative flex flex-col w-full min-h-40 border border-slate-200 dark:border-slate-800 
      rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      
      <header className="flex items-center justify-between bg-gradient-to-r from-[#00adef] to-[#161F32] 
        dark:to-slate-950 h-14 w-full sticky top-0 z-20 px-5 transition-colors duration-300">
        <h3 className="text-white font-bold text-lg">{Title}</h3>
        <span className="text-white/80 text-xs font-medium bg-white/10 
          dark:bg-black/20 px-3 py-1 rounded-full transition-colors duration-300">
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
            <p className="text-slate-400 dark:text-slate-500 italic transition-colors duration-300">
              No applications found.
            </p>
          </div>
        )}
      </div>

      {hasMore && (
        <button onClick={handleSeeAll}
          className="absolute right-6 bottom-4 text-[#00adef] hover:text-[#2845D6] dark:hover:text-[#5bc8f5]
            hover:underline font-bold text-sm transition-colors duration-300">
          See all ({applications.length - 6} more)
        </button>
      )}
    </div>
  );
};

export default ApplicationContent;