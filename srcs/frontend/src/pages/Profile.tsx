import { useState, useEffect } from 'react';
import { Logout } from '@/components/LogOut';
import { useParams } from 'react-router-dom'
import { ProfileCover } from "@/components/ProfileCover"
import SkillsCard from "@/components/ui/SkillsCard"
import { ToastContainer } from "react-toastify";
import { mainApi } from '@/utils/Api';

export function Profile() {
  const params = useParams();
  const id = params.postId;
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

 
  useEffect(() => {
    const fetchUser = async () => {
      try{

        const [res1, res2] = await Promise.all([
          mainApi.get(`/api/users/${id}`),
          mainApi.get(`/api/profiles/${id}`),
        ]);

        const userData = res1.data;
        const profileData = res2.data;

        console.log("userData :", userData);
        console.log("profileData :", profileData);
        setUser(userData.data);
        setProfile(profileData.data);
      }catch (err){
        console.log("Err :", err);
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
        <div className='flex gap-10 p-2'>
          <h1 className='text-black dark:text-white font-medium text-sm'>{title}:</h1>
          {value 
            ? 
              <p className='text-gray-500 dark:text-gray-400 font-medium text-sm'>{value}</p>
            :
              <p className='text-gray-500 dark:text-gray-600 font-medium text-sm italic'>Not set</p>}
        </div>
      );
    }

    return (
      <div className="flex-1 w-full md:w-auto lg:col-span-4 p-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="pramary-text text-xl font-bold flex items-center gap-2">
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
    <div className="flex flex-col gap-4 p-6 overflow-y-auto no-scrollbar items-center h-full w-full">
      <ToastContainer />
      
      <div className='w-full mt-10'>
        <ProfileCover profile={profile} user={user}/>
      </div>

      <div className='w-full grid grid-cols-1 lg:grid-cols-5 gap-4'>
        <div className='col-span-1 lg:col-span-3 p-2 bg-white dark:bg-slate-900 border 
          border-gray-200 dark:border-gray-800 rounded-lg transition-colors'>
          <UserInfoCard profile={profile} user={user}/>
        </div>

        <div className='col-span-1 lg:col-span-2 w-full p-2 bg-white dark:bg-slate-900 border
           border-gray-200 dark:border-gray-800 rounded-lg transition-colors'>
          {profile && <SkillsCard profile={profile} />}
        </div>
      </div>

      <div className='w-full items-center mb-10'>
        <Logout />
      </div>

    </div>
  );
}