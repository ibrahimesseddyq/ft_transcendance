import { useState, useEffect } from 'react';
import { Logout } from '@/components/LogOut';
import { useParams } from 'react-router-dom'
import { ProfileCover } from "@/components/ProfileCover"
import SkillsCard from "@/components/ui/SkillsCard"
import { ToastContainer } from "react-toastify";
import { mainService } from '@/utils/Api';
import { AiChatButton } from '@/components/ui/AiChatButton'

export function Profile() {
  const params = useParams();
  const id = params.postId;
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;
  const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");

 
  useEffect(() => {
    const fetchUser = async () => {
      try{

        const [res1, res2] = await Promise.all([
          mainService.get(`${env_main_api}/users/${id}`),
          mainService.get(`${env_main_api}/profiles/${id}`),
        ]);

        const userData = res1.data;
        const profileData = res2.data;
        setUser(userData.data);
        setProfile(profileData.data);
      }catch (err){

      }
    };

    fetchUser();
  }, [id]);

 

  const UserInfoCard = ({user, profile}:any) => {
    const info = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
      phone: profile?.phone,
      currentTitle: profile?.currentTitle,
      linkedinUrl: profile?.linkedinUrl,
      portfolioUrl: profile?.portfolioUrl,
      currentCompany: profile?.currentCompany,
    }
   
    const SingleLine = ({title, value}: any) => {
      return (
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3'>
          <h1 className='text-black dark:text-surface-main font-medium text-sm sm:min-w-[140px]'>{title}:</h1>
          {value 
            ? 
              <p className='text-gray-500 dark:text-gray-400 font-medium text-sm break-all sm:text-right'>{value}</p>
            :
              <p className='text-gray-500 dark:text-gray-600 font-medium text-sm italic sm:text-right'>Not set</p>}
        </div>
      );
    }

    return (
      <div className="flex-1 w-full md:w-auto p-2 sm:p-3">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-[#00adef] text-lg sm:text-xl font-semibold flex items-center gap-2">
              Personal details
            </h2>
          </div>
          <div className='flex flex-col mt-5 divide-y-2 divide-gray-200 dark:divide-gray-800'>
            <SingleLine title="First Name" value={info.firstName}/>
            <SingleLine title="Last Name" value={info.lastName}/>
            <SingleLine title="Email" value={info.email}/>
            <SingleLine title="Phone Number" value={info.phone}/>
            <SingleLine title="Current Title" value={info.currentTitle}/>
            <SingleLine title="LinkedIn URL" value={info.linkedinUrl}/>
            <SingleLine title="Portfolio URL" value={info.portfolioUrl}/>
            <SingleLine title="Current Company" value={info.currentCompany}/>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6 overflow-y-auto no-scrollbar items-center w-full max-w-screen-2xl mx-auto">
      <ToastContainer />
      
      <div className='w-full mt-4 sm:mt-8'>
        <ProfileCover profile={profile} user={user}/>
      </div>

      <div className='w-full grid grid-cols-1 xl:grid-cols-5 gap-4'>
        <div className='xl:col-span-3 p-2 sm:p-3 bg-surface-main dark:bg-secondary-darkbg border 
          border-gray-200 dark:border-gray-800 rounded-xl transition-colors shadow-sm'>
          <UserInfoCard profile={profile} user={user}/>
        </div>

        <div className='xl:col-span-2 w-full p-2 sm:p-3 bg-surface-main dark:bg-secondary-darkbg border
           border-gray-200 dark:border-gray-800 rounded-xl transition-colors shadow-sm'>
          {profile && <SkillsCard profile={profile} />}
        </div>
      </div>

      <div className='w-full items-center mb-6 sm:mb-10'>
        <Logout />
      </div>
      
      {!isAdminOrRecruiter && (
        <AiChatButton />
      )}

    </div>
  );
}