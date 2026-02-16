import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import ApplicationContent from '@/components/ui/ApplicationContent';

export function Application(){
    const params = useParams();
    const jobId = params.jobId;
    const [applications, setApplications] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/applications`);
            
            if (res.ok) {
              const jobApplications = await res.json();
              setApplications(jobApplications.data);
            }
        };
    
        fetchUser();
    }, [jobId]);

    const filteredApplications = (status: string) => {

      const data = applications || [];
      const lowerSearch = searchTerm.toLowerCase();
      return data.filter((item: any) => {
        const firstName = item.user?.firstName?.toLowerCase() ?? "";
        const role = item.user?.role?.toLowerCase() ?? "";
        return firstName.includes(lowerSearch) || role.includes(lowerSearch);
      });
    };

  return (
      <div className="w-full h-full p-4 flex flex-col gap-4 items-center
            transition-all overflow-y-auto custom-scrollba">
        {/* {applications?.data}sssssssss */}
        {/* <h1>{applications?.data}</h1> */}
        <ApplicationContent Title={"Pending"} applications={applications}/>
        {/* <ApplicationContent Title={"Reviewed"} Users={filteredApplications("Reviewed")}/>
        <ApplicationContent Title={"Test Task"} Users={filteredApplications("Test Task")}/>
        <ApplicationContent Title={"Iterview"} Users={filteredApplications("Iterview")}/>
        <ApplicationContent Title={"Hired"} Users={filteredApplications ("Hired")}/> */}
            
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
