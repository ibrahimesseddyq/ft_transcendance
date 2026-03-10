import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainApi } from '@/utils/Api'

interface props{
  candidateId: string,
  applicationId: string,
}
const UserCard = ({ candidateId, applicationId }: props) => {
    const BACKEND_URL = import.meta.env.VITE_MAIN_SERVICE_URL;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const avatarUrl = `${BACKEND_URL}${(user as any)?.avatarUrl}`;
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    console.log(candidateId)
    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
          const res = await mainApi.get(`${env_main_api}/users/${candidateId}`);
          
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
      navigate(`/Profile/${candidateId}`, { 
        state: {
          postId: candidateId,
      } 
    });
  };
  const handleSeeDetails = () => {
    navigate(`/ApplicationDetails/${applicationId}`);
  };
  
  return (
    <div className="group w-full md:w-[200px] md:max-w-[300px] min-h-20 
        overflow-hidden p-4 bg-gray-50 dark:bg-slate-800/80 items-center rounded-xl 
        shadow-lg dark:shadow-none border border-transparent dark:border-slate-700 
        transition-colors duration-300">
        
      <div className="h-full flex flex-col justify-between items-center">
        
        <div className="h-20 w-20 rounded-full bg-cover bg-center mx-auto
            border-2 border-gray-800 dark:border-slate-300 group-hover:border-[#00adef] 
            dark:group-hover:border-[#5bc8f5] transition-all"
            style={{ 
              backgroundImage: `url("${avatarUrl}")` 
            }}
          />
          
          <div className='flex flex-col gap-0 mt-3'>
            <h1 className='text-center text-md font-bold font-sans text-[#445a84] dark:text-slate-100'>
              {(user as any)?.firstName} {(user as any)?.lastName}
            </h1>
            <h1 className='text-center text-sm font-light font-sans text-[#445a84] dark:text-slate-400'>
              {(user as any)?.email}
            </h1>
          </div>

          <div className="flex flex-grow md:flex-col mt-6 md:mt-4 gap-2 w-full items-center">
            <button onClick={handleSeeDetails}
              className='text-center font-medium font-sans w-full md:w-28 h-10
              rounded-xl border border-[#25aeca] dark:border-[#5bc8f5] 
              text-[#25aeca] dark:text-[#5bc8f5] hover:bg-[#25aeca] hover:text-white 
              dark:hover:bg-[#5bc8f5] dark:hover:text-slate-900 transition-colors p-2'>
              Details
            </button>
            
            <button onClick={handleSeeProfile}
              className='text-center font-medium font-sans w-full md:w-28 h-10
              rounded-xl bg-[#25aeca] dark:bg-[#00adef] text-white
              hover:bg-[#25aeca]/80 dark:hover:bg-[#00adef]/80 transition-colors p-2'>
              Profile
            </button>
          </div>
          
      </div>
    </div>
  );
};

export default UserCard;