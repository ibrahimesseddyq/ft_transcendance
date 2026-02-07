import { useAuthStore } from '@/utils/ZuStand';
import ApplicationContent  from '@/components/ui/ApplicationContent'
export function Applications(){
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
    const Users = [{
        profile: profile,
        user: user,
    }, {
        profile: profile,
        user: user,
    }, {
        profile: profile,
        user: user,
    }, {
        profile: profile,
        user: user,
    }, ];
  return (
      <div className="w-full h-full p-4 flex flex-col gap-4 items-center
            transition-all overflow-y-auto custom-scrollba">
         <ApplicationContent Title={"hello world"} Users={Users}/>
         <ApplicationContent Title={"hello world"} Users={Users}/>
         <ApplicationContent Title={"hello world"} Users={Users}/>
         <ApplicationContent Title={"hello world"} Users={Users}/>
         <ApplicationContent Title={"hello world"} Users={Users}/>
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
