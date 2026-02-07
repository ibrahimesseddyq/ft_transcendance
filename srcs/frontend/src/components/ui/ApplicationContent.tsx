import UserCard  from '@/components/ui/UserCard'
import { useAuthStore } from '@/utils/ZuStand';

interface props {
  Title: string;
  Users: any;
}

const ApplicationContent = ({Title, Users}: props) => {
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
  return (
    <div className="relative flex flex-col w-full min-h-20 border rounded-xl overflow-hidden items-center justify-center">
        <header className="flex items-center justify-between bg-gradient-to-r from-[#00adef] via-[#44bbea] to-transparent
            h-full w-full max-h-16 sticky top-0 z-20">
            <h3 className="header-title ml-5 m-3">{Title}</h3>
        </header>

      <div className="flex flex-wrap gap-4 items-center p-2">
        {Users.map((item:any) => (
            <UserCard User={item.user} Profile={item.profile}/>
        ))}
      </div>
      <button className='absolute right-4 bottom-4 text-[2845D6] hover:underline font-semibold font-sans'>
        see all
      </button>
    </div>
  );
};

export default ApplicationContent;