import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '@/utils/Api'

const UserCard = (candidateId: any) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const avatarUrl = `${BACKEND_URL}${(user as any)?.avatarUrl}`;

    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
          const res = await api.get(`/api/users/${candidateId}`);
          
          const data = res.data;
          if (data.data){
            setUser(data.data);
          }
        }catch(err){
          console.log(err);
        }
      }
      fetchUserContent();
    }, [candidateId]);


  const handleSeeProfile = () => {
      navigate(`/Profile/${candidateId?.candidateId}`, { 
        state: {
          postId: candidateId,
      } 
    });
  };
  return (
    <div className="w-full md:w-[200px] md:max-w-[300px] min-h-20 
        overflow-hidden p-4 bg-gray-50 items-center rounded-xl shadow-lg">
      <div className="h-full flex flex-col  justify-between items-center">
        <div className="h-20 w-20  rounded-full bg-cover bg-center mx-auto
            border-2 border-gray-800 group-hover:border-[#00adef] transition-all"
            style={{ 
              backgroundImage: `url("${avatarUrl}")` 
            }}
          />
          <div className='flex flex-col gap-0'>
            <h1 className='text-center text-md font-bold font-sans text-[#445a84]'>{(user as any)?.firstName} {(user as any)?.lastName}</h1>
            <h1 className='text-center text-md font-ligth font-sans text-[#445a84]'>{(user as any)?.email}</h1>
          </div>


          <div className="flex flex-grow md:flex-col mt-10 md:m-0 gap-2">
            <button className='text-center font-medium font-sans w-28 h-10
              rounded-xl border border-[#25aeca] p-2'>
              Details
            </button>
            <button onClick={handleSeeProfile}
              className='text-center font-medium font-sans w-28 h-10
              rounded-xl bg-[#25aeca] hover:bg-[#25aeca]/60 p-2'>
              Profile
            </button>
          </div>
      </div>
    </div>
  );
};

export default UserCard;