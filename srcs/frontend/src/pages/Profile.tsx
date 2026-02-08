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
  console.log("avatarUrl : ", avatarUrl);
  
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
          console.log("profile data is :", profileData.data);
        }
    };

    fetchUser();
  }, [id]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full p-6  
      overflow-y-auto no-scrollbar items-center">
      <div className='col-span-3 mt-10'>
        <ProfileCover profile={profile} user={user}/>
      </div>
      <div className='col-span-1 md:col-span-2 p-2 h-44 bg-white border rounded-lg'></div>
      <div className='col-span-1 md:col-span-1 p-2 h-44 bg-white border rounded-lg'></div>
      <div className='col-span-1 md:col-span-2 p-2 h-44 bg-white border rounded-lg'></div>
      <div className='col-span-1 md:col-span-1 p-2 h-44 bg-white border rounded-lg'></div>
      {/* <div className="relative mb-6">
        <div 
          style={{ backgroundImage: `url("${avatarUrl}")` }}
          className="h-32 w-32 rounded-3xl bg-cover bg-center border-2 border-[#161F32] shadow-2xl"
        />
      </div>
      <div className='flex flex-wrap gap-4 w-full items-stretch'>
        <CareerCard />
        <SkillsCard />
        <UserInfoCard user={user} />
        <EducationCard/>
      </div> */}
      <Logout />
    </div>
  );
}