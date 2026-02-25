import { useState, useEffect } from 'react';
import { Logout } from '@/components/LogOut';
import { useParams } from 'react-router-dom'
import CareerCard from "@/components/ui/CareerCard"
import { ProfileCover } from "@/components/ProfileCover"
import SkillsCard from "@/components/ui/SkillsCard"
import EducationCard from "@/components/ui/EducationCard"

export function Profile() {
  const params = useParams();
  const id = params.postId;
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
        const [res1, res2] = await Promise.all([
          fetch(`${BACKEND_URL}/api/users/${id}`, {credentials: 'include'}),
          fetch(`${BACKEND_URL}/api/profiles/${id}`, {credentials: 'include'}),
        ]);

        if (res1.ok && res2.ok) {
          const userData = await res1.json();
          const profileData = await res2.json();
          console.log("Iam Here");
          setUser(userData.data);
          setProfile(profileData.data);
          console.log("userData.data : ", userData.data);
          console.log("profileData.data : ", profileData.data);
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
          <SkillsCard />
        </div>
      </div>

      <div className='w-full grid grid-cols-1 lg:grid-cols-5 gap-4'>
        <div className='col-span-1 lg:col-span-3 p-2 bg-white dark:bg-slate-900 border 
          border-gray-200 dark:border-gray-800 rounded-lg transition-colors'>
          <CareerCard />
        </div>
        <div className='col-span-1 lg:col-span-2 p-2 bg-white dark:bg-slate-900 border 
          border-gray-200 dark:border-gray-800 rounded-lg h-full transition-colors'>
          <EducationCard/>
        </div>
      </div>

      <div className='w-full items-center mb-10'>
        <Logout />
      </div>
    </div>
  );
}