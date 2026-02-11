import UserCard from '@/components/ui/UserCard';
import { useNavigate } from 'react-router-dom';

interface Props {
  Title: string;
  applications: any;
}

const ApplicationContent = ({ Title, applications }: Props) => {

  // console.log("Application content = ", applications);
  // console.log("candidateId = ", applications[0].candidateId);
  // const filteredApplications = (searchTerm: string) => {

  //     const data = applications || [];
  //     const lowerSearch = searchTerm.toLowerCase();
  //     return data.filter((item: any) => {
  //       const firstName = item.user?.firstName?.toLowerCase() ?? "";
  //       const role = item.user?.role?.toLowerCase() ?? "";
  //       return firstName.includes(lowerSearch) || role.includes(lowerSearch);
  //     });
  //   };
  // return;
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
  console.log("limitedUsers : ", limitedUsers);
  // return ;
  return (
    <div className="relative flex flex-col w-full min-h-40 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <header className="flex items-center justify-between bg-gradient-to-r from-[#00adef] to-[#161F32] h-14 w-full sticky top-0 z-20 px-5">
        <h3 className="text-white font-bold text-lg">{Title}</h3>
        <span className="text-white/70 text-xs font-medium bg-white/10 px-2 py-1 rounded-full">
          {applications.length} Total
        </span>
      </header>

      <div className="flex flex-wrap gap-6 items-center p-6 pb-16 justify-center sm:justify-start">
        {limitedUsers.length > 0 ? (
          limitedUsers.map((item:any) => (
            <UserCard 
              key={item.id} 
              candidateId={item.candidateId}
            />
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-slate-400 italic">No applications found.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <button onClick={handleSeeAll}
          className="absolute right-6 bottom-4 text-[#00adef] hover:text-[#2845D6] 
            hover:underline font-bold text-sm transition-colors">
          See all ({applications.length - 6} more)
        </button>
      )}
    </div>
  );
};

export default ApplicationContent;