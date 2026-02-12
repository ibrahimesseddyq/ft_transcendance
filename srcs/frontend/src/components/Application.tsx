import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplicationContent from '@/components/ui/ApplicationContent';

export function Application(){
    const params = useParams();
    const jobId = params.jobId;
    const [Users, setUsers] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    console.log("Job id : ", jobId);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`${BACKEND_URL}/api/profiles/${jobId}`);
    
            if (res.ok) {
              const jobUsers = await res.json();
              setUsers(jobUsers.data);
              console.log("job Users is :", Users);
            }
        };
    
        fetchUser();
      }, [jobId]);

  return (
      <div className="w-full h-full p-4 flex flex-col gap-4 items-center
            transition-all overflow-y-auto custom-scrollba">
         <ApplicationContent Title={"hello 1"} Users={Users}/>
         <ApplicationContent Title={"hello 2"} Users={Users}/>
         <ApplicationContent Title={"hello 3"} Users={Users}/>
         <ApplicationContent Title={"hello 4"} Users={Users}/>
         <ApplicationContent Title={"hello 5"} Users={Users}/>
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
