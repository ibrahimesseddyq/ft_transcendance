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
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;

  useEffect(() => {
    const fetchUser = async () => {
        const [res1, res2] = await Promise.all([
          fetch(`${BACKEND_URL}/api/users/${id}`),
          fetch(`${BACKEND_URL}/api/profiles/${id}`),
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
   
    const SingleLine = ({title, value}: any) =>{
      return (
        <div className='flex gap-10 p-2'>
          <h1 className='text-black font-medium text-sm'>{title}:</h1>
          {value 
            ? 
              <p className='text-gray-500 font-medium text-sm'>{value}</p>
            :
              <p className='text-gray-500 font-medium text-sm'>Not set</p>}
        </div>
      );
    }
    return (
      <div className="flex-1 w-full md:w-auto lg:col-span-4 p-2 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="pramary-text text-xl flex items-center gap-2">
              Personal details
            </h2>
          </div>
          <div className='flex flex-col mt-5 divide-y-2 divide-gray-200 '>
            <SingleLine title="firstName" value={info.firstName}/>
            <SingleLine title="lastName" value={info.lastName}/>
            <SingleLine title="email" value={info.email}/>
            <SingleLine title="phoneNumber" value={info.phone}/>
            <SingleLine title="currentTitle" value={info.currentTitle}/>
            <SingleLine title="linkedinUrl" value={info.linkedinUrl}/>
            <SingleLine title="portfolioUrl" value={info.portfolioUrl}/>
            <SingleLine title="currentCompany" value={info.currentCompany}/>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto no-scrollbar items-center h-full w-full">
      <div className='w-full mt-10'>
        <ProfileCover profile={profile} user={user}/>
      </div>
      <div className='w-full  grid grid-cols-1 lg:grid-cols-5 gap-4'>
        <div className='col-span-1 lg:col-span-3  p-2 bg-white border rounded-lg'>
          <UserInfoCard profile={profile} user={user}/>
        </div>
        <div className='col-span-1 lg:col-span-2  w-full p-2 bg-white border rounded-lg'>
          <SkillsCard />
        </div>
      </div>
      <div className='w-full grid grid-cols-1 lg:grid-cols-5 gap-4'>
        <div className='col-span-1 lg:col-span-3 p-2 bg-white border rounded-lg'>
          <CareerCard />
        </div>
        <div className='col-span-1 lg:col-span-2 p-2  bg-white border rounded-lg h-full'>
          <EducationCard/>
        </div>
      </div>
      <div className='w-full items-center'>
        <Logout />
      </div>
    </div>
  );
}