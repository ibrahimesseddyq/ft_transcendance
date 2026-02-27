import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApplicationContent from '@/components/ui/ApplicationContent';
import { useSecureFetch } from '@/utils/SecureFetch'

export function Application(){
    const secureFetch = useSecureFetch();
    const params = useParams();
    const jobId = params.jobId;
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await secureFetch(`/api/jobs/${jobId}/applications`);
            
            if (res.ok) {
              const jobApplications = await res.json();
              setApplications(jobApplications.data);
            }
        };
    
        fetchUser();
    }, [jobId]);

    // const filteredApplications = (status: string) => {

    //   const data = applications || [];
    //   const lowerSearch = searchTerm.toLowerCase();
    //   return data.filter((item: any) => {
    //     const firstName = item.user?.firstName?.toLowerCase() ?? "";
    //     const role = item.user?.role?.toLowerCase() ?? "";
    //     return firstName.includes(lowerSearch) || role.includes(lowerSearch);
    //   });
    // };

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
